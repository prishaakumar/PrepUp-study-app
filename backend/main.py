from fastapi import FastAPI, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
import openai
from PyPDF2 import PdfReader
import io
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi.responses import FileResponse
from fastapi import HTTPException

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./documents.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    original_filename = Column(String)
    upload_time = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow all origins for dev (you can restrict this later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

@app.post("/api/ask")
async def ask(question: str = Form(...), documents: UploadFile = File(None)):
    context = ""
    if documents:
        pdf_bytes = await documents.read()
        pdf_file = io.BytesIO(pdf_bytes)
        context = extract_text_from_pdf(pdf_file)
        if not context.strip():
            return {"answer": "Sorry, I could not extract any text from the provided PDF."}
    else:
        context = "No document provided."

    prompt = f"You are an expert tutor. Use the following document to answer the question.\n\nDocument:\n{context}\n\nQuestion: {question}\n\nAnswer:"

    try:
        client = openai.OpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful tutor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=512,
            temperature=0.2,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        answer = f"Error contacting OpenRouter: {e}"

    return {"answer": answer}

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    session = SessionLocal()
    try:
        # Save file to disk
        filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        # Save metadata to DB
        doc = Document(
            filename=filename,
            original_filename=file.filename,
            file_path=file_path
        )
        session.add(doc)
        session.commit()
        session.refresh(doc)
        return {"id": doc.id, "filename": doc.original_filename, "upload_time": doc.upload_time}
    finally:
        session.close()

@app.get("/api/documents")
def list_documents():
    session = SessionLocal()
    try:
        docs = session.query(Document).all()
        return [
            {"id": d.id, "filename": d.original_filename, "upload_time": d.upload_time}
            for d in docs
        ]
    finally:
        session.close()

@app.get("/api/documents/{doc_id}/download")
def download_document(doc_id: int):
    session = SessionLocal()
    try:
        doc = session.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return FileResponse(doc.file_path, filename=doc.original_filename)
    finally:
        session.close()

@app.post("/api/quiz/generate")
async def generate_quiz(
    subject: str = Body(...),
    questionTypes: list = Body(...),
    difficulty: int = Body(...),
    length: int = Body(...),
    resources: list = Body(default=[])
):
    session = SessionLocal()
    try:
        # Fetch and extract text from selected documents
        context = ""
        for doc_id in resources:
            doc = session.query(Document).filter(Document.id == doc_id).first()
            if doc and doc.file_path.endswith('.pdf'):
                with open(doc.file_path, 'rb') as f:
                    context += extract_text_from_pdf(f) + "\n"
        if not context.strip():
            return {"error": "No text could be extracted from the selected documents."}
        # Compose prompt for OpenAI
        prompt = f"You are an expert quiz generator. Based on the following document(s), create a quiz for the subject '{subject}'.\n"
        prompt += f"Include {length} questions. Question types: {', '.join(questionTypes)}. Difficulty: {difficulty}.\n"
        prompt += f"Document Content:\n{context[:4000]}\n"  # Truncate to fit model limits
        prompt += "Return the quiz as a JSON array with each question having: id, type, question, options (if applicable), and answer."
        try:
            client = openai.OpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1"
            )
            response = client.chat.completions.create(
                model="openai/gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful quiz generator."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1800,
                temperature=0.3,
            )
            import json
            # Try to extract JSON from the response
            content = response.choices[0].message.content.strip()
            try:
                # Find the first and last brackets to extract JSON array
                start = content.find('[')
                end = content.rfind(']') + 1
                quiz_json = content[start:end]
                questions = json.loads(quiz_json)
            except Exception:
                questions = [content]  # fallback: return raw content
        except Exception as e:
            return {"error": f"Error contacting OpenRouter: {e}"}
        return {
            "subject": subject,
            "questionTypes": questionTypes,
            "difficulty": difficulty,
            "length": length,
            "resources": resources,
            "questions": questions
        }
    finally:
        session.close() 