import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { DocumentProvider } from './contexts/DocumentContext';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <DocumentProvider>
            <App />
        </DocumentProvider>
    </React.StrictMode>
);
