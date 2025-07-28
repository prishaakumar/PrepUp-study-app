import React, { useEffect, useState, useRef } from 'react';
import Button from '../components/ui/Button';

const API_BASE = '/api/documents';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const fetchDocuments = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setDocuments(data);
        } catch (err) {
            setError('Failed to fetch documents.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = async (e) => {
        setError('');
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            await fetchDocuments();
        } catch (err) {
            setError('Upload failed.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Document Manager</h1>
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="border rounded px-2 py-1"
                />
                <Button onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div>
                <h2 className="text-lg font-semibold mb-2">Available Documents</h2>
                <ul className="divide-y">
                    {documents.length === 0 && <li className="py-2">No documents uploaded yet.</li>}
                    {documents.map(doc => (
                        <li key={doc.id} className="py-2 flex items-center justify-between">
                            <span>{doc.filename}</span>
                            <a
                                href={`${API_BASE}/${doc.id}/download`}
                                className="text-blue-600 hover:underline ml-4"
                                download
                            >
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentManager; 