import { getDocument } from 'pdfjs-dist';

export const loadPDF = (pdfUrl, pdfPassword) => {
  getDocument({ url: pdfUrl, password: pdfPassword })
    .promise.then((pdfDoc) => {
      console.log(`PDF loaded successfully. Total pages: ${pdfDoc.numPages}`);
      // Handle the successfully loaded PDF here (e.g., render it on the screen)
    })
    .catch((error) => {
      console.error("Error loading PDF:", error);

      if (error.name === "PasswordException") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Failed to load the PDF document. Please check the file.");
      }
    });
};