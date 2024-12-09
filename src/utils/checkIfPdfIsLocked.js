/* eslint-disable no-unused-vars */
import * as pdfjsLib from "pdfjs-dist";

export const checkIfPdfIsLocked = async (file, setIsLocked) => {
  if (!file) {
    alert("Please upload a PDF file first.");
    return;
  }

  try {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        // Load the PDF file with pdf.js
        const pdfData = new Uint8Array(fileReader.result);
        const loadingTask = pdfjsLib.getDocument(pdfData);

        // Check if the document is password-protected
        await loadingTask.promise;
        setIsLocked(false);
      } catch (error) {
        if (error.name === "PasswordException") {
          setIsLocked(true);
        } else {
          alert("Error reading PDF.");
        }
      }
    };

    fileReader.readAsArrayBuffer(file);
  } catch (error) {
    alert("Error reading the file.");
  }
};
