import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import DocumentUpload from '../../study-plan-generator/components/DocumentUpload';

const API_BASE = '/api/documents';

const QuizSetup = ({ onStartQuiz }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    fillInBlank: false,
    shortAnswer: false
  });
  const [difficulty, setDifficulty] = useState(2);
  const [quizLength, setQuizLength] = useState(10);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('quizSubjects');
    return saved ? JSON.parse(saved) : [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'history', label: 'History' },
      { value: 'english', label: 'English Literature' },
      { value: 'computer-science', label: 'Computer Science' },
      { value: 'psychology', label: 'Psychology' }
    ];
  });
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    localStorage.setItem('quizSubjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchDocuments();
  }, []);

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    const value = newSubject.trim().toLowerCase().replace(/\s+/g, '-');
    if (subjects.some(s => s.value === value)) return;
    setSubjects([...subjects, { value, label: newSubject.trim() }]);
    setNewSubject('');
  };
  const handleDeleteSubject = (value) => {
    setSubjects(subjects.filter(s => s.value !== value));
    if (selectedSubject === value) setSelectedSubject('');
  };

  const difficultyLabels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
  const quizLengthOptions = [5, 10, 15, 20, 25, 30];

  const handleQuestionTypeChange = (type, checked) => {
    setQuestionTypes(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleDocSelect = (docId) => {
    setSelectedDocs(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleFilesUploaded = async (fileData) => {
    setUploadedFiles(prev => [...prev, fileData]);
    // After upload, refresh documents list
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setDocuments(data);
    } catch (err) { }
  };
  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleStartQuiz = () => {
    const selectedTypes = Object.keys(questionTypes).filter(type => questionTypes[type]);

    if (!selectedSubject || selectedTypes.length === 0) {
      return;
    }

    const quizConfig = {
      subject: selectedSubject,
      questionTypes: selectedTypes,
      difficulty,
      length: quizLength,
      resources: selectedDocs, // Pass selected document IDs
    };

    onStartQuiz(quizConfig);
  };

  const isStartDisabled = !selectedSubject || Object.values(questionTypes).every(val => !val);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Brain" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Create Your Quiz</h2>
          <p className="text-muted-foreground">
            Customize your practice session to match your learning goals
          </p>
        </div>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <span>Select Subject</span>
              <button
                type="button"
                className="ml-1 p-1 rounded hover:bg-muted"
                onClick={() => setShowSubjectModal(true)}
                aria-label="Manage Subjects"
              >
                <Icon name="Settings" size={16} />
              </button>
            </label>
            <Select
              options={subjects}
              value={selectedSubject}
              onChange={setSelectedSubject}
              placeholder="Choose a subject to practice"
              searchable
            />
            {showSubjectModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-card rounded-lg p-6 shadow-lg relative w-full max-w-md mx-auto">
                  <button
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setShowSubjectModal(false)}
                  >
                    <Icon name="X" size={20} />
                  </button>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Manage Subjects</h3>
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="Add new subject"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddSubject(); }}
                    />
                    <Button onClick={handleAddSubject} iconName="Plus" size="sm">Add</Button>
                  </div>

                  {/* Question Types */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Question Types
                    </label>
                    <div className="space-y-3">
                      <Checkbox
                        label="Multiple Choice"
                        description="Select the correct answer from given options"
                        checked={questionTypes.multipleChoice}
                        onChange={(e) => handleQuestionTypeChange('multipleChoice', e.target.checked)}
                      />
                      <Checkbox
                        label="Fill in the Blank"
                        description="Complete sentences with missing words"
                        checked={questionTypes.fillInBlank}
                        onChange={(e) => handleQuestionTypeChange('fillInBlank', e.target.checked)}
                      />
                      <Checkbox
                        label="Short Answer"
                        description="Provide brief written responses"
                        checked={questionTypes.shortAnswer}
                        onChange={(e) => handleQuestionTypeChange('shortAnswer', e.target.checked)}
                      />
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Difficulty Level: {difficultyLabels[difficulty]}
                    </label>
                    <div className="px-3">
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        {difficultyLabels.map((label, index) => (
                          <span key={index} className={difficulty === index ? 'text-primary font-medium' : ''}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quiz Length */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Questions
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {quizLengthOptions.map((length) => (
                        <button
                          key={length}
                          onClick={() => setQuizLength(length)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${quizLength === length
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:bg-muted'
                            }`}
                        >
                          {length}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resource Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Resources (Documents)
                    </label>
                    <ul className="divide-y mb-4">
                      {documents.length === 0 && <li className="py-2 text-muted-foreground">No documents available.</li>}
                      {documents.map(doc => (
                        <li key={doc.id} className="py-2 flex items-center">
                          <Checkbox
                            checked={selectedDocs.includes(doc.id)}
                            onChange={() => handleDocSelect(doc.id)}
                            id={`doc-${doc.id}`}
                            label={doc.filename}
                          />
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      iconName="Upload"
                      onClick={() => setShowUploadModal(true)}
                      className="mb-2"
                    >
                      Add Resource
                    </Button>
                    {showUploadModal && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-card rounded-lg p-6 shadow-lg relative w-full max-w-lg mx-auto">
                          <button
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                            onClick={() => setShowUploadModal(false)}
                          >
                            <Icon name="X" size={20} />
                          </button>
                          <DocumentUpload
                            onFilesUploaded={handleFilesUploaded}
                            uploadedFiles={uploadedFiles}
                            onRemoveFile={handleRemoveFile}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Start Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleStartQuiz}
                      disabled={isStartDisabled}
                      className="w-full"
                      iconName="Play"
                      iconPosition="left"
                    >
                      Start Quiz ({quizLength} questions)
                    </Button>
                    {isStartDisabled && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Please select a subject and at least one question type
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;