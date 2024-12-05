import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import StarLoader from "./loaders/StarLoader";

// Set the worker source to the local path for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function Shap() {
  const [processedFile, setProcessedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const fileBuffer = await file.arrayBuffer();
        setIsLoading(true);
        const cutPdf = await processPdf(fileBuffer);
        setIsLoading(false);
        setProcessedFile(cutPdf);
      } catch (error) {
        console.error("Error processing PDF:", error);
        alert("An error occurred while processing the PDF.");
      }
    } else {
      console.log("Please upload a valid PDF file.");
    }
  };

  // Function to render PDF page with vector quality
  const renderPdfPage = async (fileBuffer, pageNumber, scale = 2) => {
    const typedArray = new Uint8Array(fileBuffer);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    // Create a canvas to render the vector content
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // Render the PDF page (vector content) to the canvas
    await page.render(renderContext).promise;

    return canvas;
  };

  const processPdf = async (fileBuffer) => {
    try {
      // Load the original PDF document
      const originalPdfDoc = await PDFDocument.load(fileBuffer);
  
      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();
  
      // Copy pages from the original document to the new one
      const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, [0]); // Adjust the page numbers as needed
  
      // Add the copied pages to the new document
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });
  
      // Save the new PDF as a Blob URL
      const pdfBytes = await newPdfDoc.save();
      return URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (err) {
      console.error(err);
      alert("Error during PDF processing.");
    }
  };
  

  

  return (
    <div className="App">
      <h1>PDF Cutter</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <div style={{ margin: "5vh" }}>
        {isLoading && <StarLoader />}
      </div>
      <br />
      {processedFile && (
        <div>
          <embed src={processedFile} width="600" height="800" type="application/pdf" />
          <br />
          <a href={processedFile} download="processed.pdf">
            Download Processed PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default Shap;
