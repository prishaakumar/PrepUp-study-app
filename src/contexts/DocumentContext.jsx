import React, { createContext, useContext, useState } from 'react';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const addFiles = (files) => {
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const clearFiles = () => setUploadedFiles([]);

    return (
        <DocumentContext.Provider value={{ uploadedFiles, addFiles, clearFiles }}>
            {children}
        </DocumentContext.Provider>
    );
}; 