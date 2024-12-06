import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const UnlockPDFViewer = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError('');
  };

  const onDocumentLoadError = (err) => {
    console.error('Error loading document:', err.message);
    setError('Failed to load PDF. Check the password.');
  };

  return (
    <div>
      <h1>Unlock and View PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {file && (
        <>
          <input
            type="password"
            placeholder="Enter PDF password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Document
            file={{
              data: file,
              password, // Pass the password to the viewer
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UnlockPDFViewer;
