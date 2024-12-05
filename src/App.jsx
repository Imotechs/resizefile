// // import React, { useState } from "react";
// // import { PDFDocument } from "pdf-lib";
// // import { createCanvas, loadImage } from "canvas";
// // import * as pdfjsLib from "pdfjs-dist";
// // import Tesseract from "tesseract.js";

// // // Set the worker source to the local path
// // pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// // function App() {
// //   const [processedFile, setProcessedFile] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleFileUpload = async (event) => {
// //     const file = event.target.files[0];
// //     if (file && file.type === "application/pdf") {
// //       try {
// //         const fileBuffer = await file.arrayBuffer();
// //         setIsLoading(true);
// //         const cutPdf = await processPdf(fileBuffer);
// //         setIsLoading(false);
// //         setProcessedFile(cutPdf);
// //       } catch (error) {
// //         console.error("Error processing PDF:", error);
// //         alert("An error occurred while processing the PDF.");
// //       }
// //     } else {
// //       console.log("Please upload a valid PDF file.");
// //     }
// //   };

// //   const processPdf = async (fileBuffer) => {
// //     try {
// //       const pdfDoc = await PDFDocument.load(fileBuffer);
// //       const pages = pdfDoc.getPages();
// //       const firstPage = pages[0];

// //       const pageImage = await pdfToImage(fileBuffer, 1);
// //       const canvas = createCanvas(pageImage.width, pageImage.height);
// //       const ctx = canvas.getContext("2d");
// //       ctx.drawImage(pageImage, 0, 0);

// //       const cutLineY = await detectDashedLine(canvas);
// //       const cutRegions = await detectCutLines(canvas, cutLineY);

// //       const croppedLeft = cropImage(canvas, cutRegions[1].x, cutRegions[1].y, cutRegions[1].width, cutRegions[1].height);
// //       const croppedRight = cropImage(canvas, cutRegions[2].x, cutRegions[2].y, cutRegions[2].width, cutRegions[2].height);

// //       const trimmedLeft = trimWhiteSpace(croppedLeft);
// //       const trimmedRight = trimWhiteSpace(croppedRight);

// //       const highResLeft = increaseResolution(trimmedLeft);
// //       const highResRight = increaseResolution(trimmedRight);

// //       const verticalMargin = 60;
// //       const horizontalMargin = 40;
// //       const pageWidth = 595;
// //       const pageHeight = 842;
// //       const objectGap = 15;

// //       const scaledLeft = scaleToFit(highResLeft, pageWidth, pageHeight, verticalMargin, horizontalMargin);
// //       const scaledRight = scaleToFit(highResRight, pageWidth, pageHeight, verticalMargin, horizontalMargin);

// //       const totalHeight =  scaledLeft.height + scaledRight.height + objectGap + verticalMargin * 2;;
// //       // const totalHeight = scaledLeft.height + scaledRight.height + verticalMargin + 2 * horizontalMargin;

// //       const mergedCanvas = createCanvas(pageWidth, totalHeight);
// //       const mergedCtx = mergedCanvas.getContext("2d");

// //       const xLeft = (pageWidth - scaledLeft.width) / 2;
// //       const xRight = (pageWidth - scaledRight.width) / 2;

// //       mergedCtx.drawImage(scaledLeft, xLeft, verticalMargin);
// //       // mergedCtx.drawImage(scaledRight, xRight, scaledLeft.height + verticalMargin * 2);
// //       mergedCtx.drawImage(scaledRight, xRight, verticalMargin + scaledLeft.height + objectGap);
// //       // mergedCtx.drawImage(scaledRight, xRight, scaledLeft.height + verticalMargin + horizontalMargin);

// //       const mergedImage = mergedCanvas.toDataURL("image/png");

// //       const newPdf = await PDFDocument.create();
// //       const embeddedImage = await newPdf.embedPng(mergedImage);
// //       const page = newPdf.addPage([pageWidth, totalHeight]);
// //       page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });

// //       return await newPdf.saveAsBase64({ dataUri: true });
// //     } catch (err) {
// //       console.log(err);
// //       alert("Error during PDF processing.");
// //     }
// //   };

// //   const pdfToImage = async (fileBuffer, pageNumber) => {
// //     const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
// //     const page = await pdf.getPage(pageNumber);

// //     const viewport = page.getViewport({ scale: 2 });
// //     const canvas = createCanvas(viewport.width, viewport.height);
// //     const context = canvas.getContext("2d");

// //     const renderContext = {
// //       canvasContext: context,
// //       viewport: viewport,
// //     };

// //     await page.render(renderContext).promise;

// //     return await loadImage(canvas.toDataURL());
// //   };

// //   const detectDashedLine = async (canvas) => {
// //     const imageData = canvas.toDataURL();

// //     const { data: { text } } = await Tesseract.recognize(imageData, "eng", {
// //       logger: (m) => null,
// //     });

// //     const dashedLinePattern = /----/g;
// //     const lines = text.split("\n");
// //     for (let i = 0; i < lines.length; i++) {
// //       if (dashedLinePattern.test(lines[i])) {
// //         const estimatedY = (i / lines.length) * canvas.height;
// //         return estimatedY;
// //       }
// //     }

// //     return canvas.height * 0.675; // Default if no dashed line found
// //   };

// //   const detectCutLines = async (canvas, cutLineY) => {
// //     const verticalCutX = canvas.width / 2;

// //     return [
// //       { x: 0, y: cutLineY, width: canvas.width, height: canvas.height - cutLineY },
// //       { x: 0, y: cutLineY, width: verticalCutX, height: canvas.height - cutLineY },
// //       { x: verticalCutX, y: cutLineY, width: canvas.width - verticalCutX, height: canvas.height - cutLineY },
// //     ];
// //   };

// //   const cropImage = (canvas, x, y, width, height) => {
// //     const croppedCanvas = createCanvas(width, height);
// //     const croppedCtx = croppedCanvas.getContext("2d");
// //     croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

// //     // Remove 3px from each side of the cropped image
// //     const croppedWithMarginCanvas = createCanvas(width - 8, height);
// //     const croppedWithMarginCtx = croppedWithMarginCanvas.getContext("2d");
// //     croppedWithMarginCtx.drawImage(croppedCanvas, 4, 0, width - 8, height, 0, 0, width - 8, height);

// //     return croppedWithMarginCanvas;
// //   };

// //   const trimWhiteSpace = (canvas) => {
// //     const ctx = canvas.getContext("2d");
// //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// //     let top = canvas.height, left = canvas.width, bottom = 0, right = 0;

// //     for (let y = 0; y < canvas.height; y++) {
// //       for (let x = 0; x < canvas.width; x++) {
// //         const index = (y * canvas.width + x) * 4;
// //         const r = imageData.data[index];
// //         const g = imageData.data[index + 1];
// //         const b = imageData.data[index + 2];
// //         const alpha = imageData.data[index + 3];

// //         if (r < 240 || g < 240 || b < 240 || alpha < 255) {
// //           if (y < top) top = y;
// //           if (y > bottom) bottom = y;
// //           if (x < left) left = x;
// //           if (x > right) right = x;
// //         }
// //       }
// //     }

// //     const trimmedCanvas = createCanvas(right - left, bottom - top);
// //     const trimmedCtx = trimmedCanvas.getContext("2d");
// //     trimmedCtx.drawImage(canvas, left, top, right - left, bottom - top, 0, 0, right - left, bottom - top);

// //     return trimmedCanvas;
// //   };

// //   const increaseResolution = (canvas) => {
// //     const scaleFactor = 2;
// //     const highResCanvas = createCanvas(canvas.width * scaleFactor, canvas.height * scaleFactor);
// //     const highResCtx = highResCanvas.getContext("2d");

// //     highResCtx.drawImage(canvas, 0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor);

// //     return highResCanvas;
// //   };

// //   const scaleToFit = (canvas, pageWidth, pageHeight, verticalMargin, horizontalMargin) => {
// //     const widthScale = (pageWidth - 2 * horizontalMargin) / canvas.width;
// //     const heightScale = (pageHeight - 2 * verticalMargin) / canvas.height;
// //     const scale = Math.min(widthScale, heightScale);

// //     const scaledCanvas = createCanvas(canvas.width * scale, canvas.height * scale);
// //     const scaledCtx = scaledCanvas.getContext("2d");

// //     scaledCtx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);

// //     return scaledCanvas;
// //   };

// //   return (
// //     <div className="App">
// //       <h1>PDF Cutter</h1>
// //       <input type="file" accept="application/pdf" onChange={handleFileUpload} />
// //       {isLoading && <p>Processing PDF...</p>}
// //       {processedFile && (
// //         <div>
// //           <embed src={processedFile} width="600" height="800" type="application/pdf" />
// //           <br />
// //           <a href={processedFile} download="processed.pdf">
// //             Download Processed PDF
// //           </a>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import { createCanvas, loadImage } from "canvas";
// import * as pdfjsLib from "pdfjs-dist";
// import Tesseract from "tesseract.js";
// import { enhanceImageQuality } from "./utils/enhanceImageQuality";
// import StarLoader from "./components/loaders/StarLoader";

// // Set the worker source to the local path
// pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// function App() {
//   const [processedFile, setProcessedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === "application/pdf") {
//       try {
//         const fileBuffer = await file.arrayBuffer();
//         setIsLoading(true);
//         const cutPdf = await processPdf(fileBuffer);
//         setIsLoading(false);
//         setProcessedFile(cutPdf);
//       } catch (error) {
//         console.error("Error processing PDF:", error);
//         alert("An error occurred while processing the PDF.");
//       }
//     } else {
//       console.log("Please upload a valid PDF file.");
//     }
//   };

//   const processPdf = async (fileBuffer) => {
//     try {
//       const pdfDoc = await PDFDocument.load(fileBuffer);
//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];

//       const pageImage = await pdfToImage(fileBuffer, 1);
//       const canvas = createCanvas(pageImage.width, pageImage.height);
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(pageImage, 0, 0);

//       // Enhance image quality
//       enhanceImageQuality(canvas);

//       // Continue with the rest of your logic...
//       const cutLineY = await detectDashedLine(canvas);
//       const cutRegions = await detectCutLines(canvas, cutLineY);

//       const croppedLeft = cropImage(canvas, cutRegions[1].x, cutRegions[1].y, cutRegions[1].width, cutRegions[1].height);
//       const croppedRight = cropImage(canvas, cutRegions[2].x, cutRegions[2].y, cutRegions[2].width, cutRegions[2].height);

//       const trimmedLeft = trimWhiteSpace(croppedLeft);
//       const trimmedRight = trimWhiteSpace(croppedRight);

//       const highResLeft = increaseResolution(trimmedLeft);
//       const highResRight = increaseResolution(trimmedRight);

//       const verticalMargin = 60;
//       const horizontalMargin = 40;
//       const pageWidth = 595;
//       const pageHeight = 842;
//       const objectGap = 15;

//       const scaledLeft = scaleToFit(highResLeft, pageWidth, pageHeight, verticalMargin, horizontalMargin);
//       const scaledRight = scaleToFit(highResRight, pageWidth, pageHeight, verticalMargin, horizontalMargin);

//       const totalHeight = scaledLeft.height + scaledRight.height + objectGap + verticalMargin * 2;

//       const mergedCanvas = createCanvas(pageWidth, totalHeight);
//       const mergedCtx = mergedCanvas.getContext("2d");

//       const xLeft = (pageWidth - scaledLeft.width) / 2;
//       const xRight = (pageWidth - scaledRight.width) / 2;

//       mergedCtx.drawImage(scaledLeft, xLeft, verticalMargin);
//       mergedCtx.drawImage(scaledRight, xRight, verticalMargin + scaledLeft.height + objectGap);

//       const mergedImage = mergedCanvas.toDataURL("image/png");

//       const newPdf = await PDFDocument.create();
//       const embeddedImage = await newPdf.embedPng(mergedImage);
//       const page = newPdf.addPage([pageWidth, totalHeight]);
//       page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });

//       return await newPdf.saveAsBase64({ dataUri: true });
//     } catch (err) {
//       console.log(err);
//       alert("Error during PDF processing.");
//     }
//   };

//   const pdfToImage = async (fileBuffer, pageNumber) => {
//     const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
//     const page = await pdf.getPage(pageNumber);

//     const viewport = page.getViewport({ scale: 2 });
//     const canvas = createCanvas(viewport.width, viewport.height);
//     const context = canvas.getContext("2d");

//     const renderContext = {
//       canvasContext: context,
//       viewport: viewport,
//     };

//     await page.render(renderContext).promise;

//     return await loadImage(canvas.toDataURL());
//   };

//   const detectDashedLine = async (canvas) => {
//     const imageData = canvas.toDataURL();

//     const { data: { text } } = await Tesseract.recognize(imageData, "eng", {
//       logger: (m) => null,
//     });

//     const dashedLinePattern = /----/g;
//     const lines = text.split("\n");
//     for (let i = 0; i < lines.length; i++) {
//       if (dashedLinePattern.test(lines[i])) {
//         const estimatedY = (i / lines.length) * canvas.height;
//         return estimatedY;
//       }
//     }

//     return canvas.height * 0.675; // Default if no dashed line found
//   };

//   const detectCutLines = async (canvas, cutLineY) => {
//     const verticalCutX = canvas.width / 2;

//     return [
//       { x: 0, y: cutLineY, width: canvas.width, height: canvas.height - cutLineY },
//       { x: 0, y: cutLineY, width: verticalCutX, height: canvas.height - cutLineY },
//       { x: verticalCutX, y: cutLineY, width: canvas.width - verticalCutX, height: canvas.height - cutLineY },
//     ];
//   };

//   const cropImage = (canvas, x, y, width, height) => {
//     const croppedCanvas = createCanvas(width, height);
//     const croppedCtx = croppedCanvas.getContext("2d");
//     croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

//     // Remove 3px from each side of the cropped image
//     const croppedWithMarginCanvas = createCanvas(width - 8, height);
//     const croppedWithMarginCtx = croppedWithMarginCanvas.getContext("2d");
//     croppedWithMarginCtx.drawImage(croppedCanvas, 4, 0, width - 8, height, 0, 0, width - 8, height);

//     return croppedWithMarginCanvas;
//   };

//   const trimWhiteSpace = (canvas) => {
//     const ctx = canvas.getContext("2d");
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//     let top = canvas.height, left = canvas.width, bottom = 0, right = 0;

//     for (let y = 0; y < canvas.height; y++) {
//       for (let x = 0; x < canvas.width; x++) {
//         const index = (y * canvas.width + x) * 4;
//         const r = imageData.data[index];
//         const g = imageData.data[index + 1];
//         const b = imageData.data[index + 2];
//         const alpha = imageData.data[index + 3];

//         if (r < 240 || g < 240 || b < 240 || alpha < 255) {
//           if (y < top) top = y;
//           if (y > bottom) bottom = y;
//           if (x < left) left = x;
//           if (x > right) right = x;
//         }
//       }
//     }

//     const trimmedCanvas = createCanvas(right - left, bottom - top);
//     const trimmedCtx = trimmedCanvas.getContext("2d");
//     trimmedCtx.drawImage(canvas, left, top, right - left, bottom - top, 0, 0, right - left, bottom - top);

//     return trimmedCanvas;
//   };

//   const increaseResolution = (canvas) => {
//     const scaleFactor = 2;
//     const highResCanvas = createCanvas(canvas.width * scaleFactor, canvas.height * scaleFactor);
//     const highResCtx = highResCanvas.getContext("2d");

//     highResCtx.drawImage(canvas, 0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor);

//     return highResCanvas;
//   };

//   const scaleToFit = (canvas, pageWidth, pageHeight, verticalMargin, horizontalMargin) => {
//     const widthScale = (pageWidth - 2 * horizontalMargin) / canvas.width;
//     const heightScale = (pageHeight - 2 * verticalMargin) / canvas.height;
//     const scale = Math.min(widthScale, heightScale);

//     const scaledCanvas = createCanvas(canvas.width * scale, canvas.height * scale);
//     const scaledCtx = scaledCanvas.getContext("2d");

//     scaledCtx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);

//     return scaledCanvas;
//   };

//   return (
//     <div className="App">
//       <h1>PDF Cutter</h1>
//       <input type="file" accept="application/pdf" onChange={handleFileUpload} />
//       <div style={{margin: '5vh'}}>
//         {isLoading && <StarLoader />}
//       </div>
//       <br />
//       {processedFile && (
//         <div>
//           <embed src={processedFile} width="600" height="800" type="application/pdf" />
//           <br />
//           <a href={processedFile} download="processed.pdf">
//             Download Processed PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { createCanvas, loadImage } from "canvas";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { enhanceImageQuality } from "./utils/enhanceImageQuality";
import StarLoader from "./components/loaders/StarLoader";
import SuccessAnimation from "./components/loaders/SuccessAnimation";
import PreviewButton from "./components/buttons/PreviewButton";

// Set the worker source to the local path
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const FilePreviewModal = ({ processedFile, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">File Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          {processedFile ? (
            <embed
              src={processedFile}
              width="100%"
              height="400"
              type="application/pdf"
              className="rounded-md border border-gray-300"
            />
          ) : (
            <p className="text-gray-500">No file to preview.</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href={processedFile}
            download="processed.pdf"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [processedFile, setProcessedFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("pdf"); // Default format is PDF

  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const fileBuffer = await file.arrayBuffer();
        setIsLoading(true);
        const { pdfData, imageData } = await processPdf(fileBuffer);
        setIsLoading(false);
        setProcessedFile(pdfData);
        setImageFile(imageData); // Store the image data as well
      } catch (error) {
        console.error("Error processing PDF:", error);
        alert("An error occurred while processing the PDF.");
      }
    } else {
      console.log("Please upload a valid PDF file.");
    }
  };

  // Function to handle the download based on the selected format
  const handleDownload = () => {
    if (downloadFormat === "pdf" && processedFile) {
      const link = document.createElement("a");
      link.href = processedFile;
      link.download = "processed-file.pdf";
      link.click();
    } else if (downloadFormat === "image" && imageFile) {
      const link = document.createElement("a");
      link.href = imageFile;
      link.download = "processed-image.png";
      link.click();
    }
  };

  const processPdf = async (fileBuffer) => {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const pageImage = await pdfToImage(fileBuffer, 1);
      const canvas = createCanvas(pageImage.width, pageImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(pageImage, 0, 0);

      // Enhance image quality
      enhanceImageQuality(canvas);

      // Continue with the rest of your logic...
      const cutLineY = await detectDashedLine(canvas);
      const cutRegions = await detectCutLines(canvas, cutLineY);

      const croppedLeft = cropImage(
        canvas,
        cutRegions[1].x,
        cutRegions[1].y,
        cutRegions[1].width,
        cutRegions[1].height
      );
      const croppedRight = cropImage(
        canvas,
        cutRegions[2].x,
        cutRegions[2].y,
        cutRegions[2].width,
        cutRegions[2].height
      );

      const trimmedLeft = trimWhiteSpace(croppedLeft);
      const trimmedRight = trimWhiteSpace(croppedRight);

      const highResLeft = increaseResolution(trimmedLeft);
      const highResRight = increaseResolution(trimmedRight);

      const verticalMargin = 60;
      const horizontalMargin = 40;
      const pageWidth = 595;
      const pageHeight = 842;
      const objectGap = 15;

      const scaledLeft = scaleToFit(
        highResLeft,
        pageWidth,
        pageHeight,
        verticalMargin,
        horizontalMargin
      );
      const scaledRight = scaleToFit(
        highResRight,
        pageWidth,
        pageHeight,
        verticalMargin,
        horizontalMargin
      );

      const totalHeight =
        scaledLeft.height + scaledRight.height + objectGap + verticalMargin * 2;

      const mergedCanvas = createCanvas(pageWidth, totalHeight);
      const mergedCtx = mergedCanvas.getContext("2d");

      const xLeft = (pageWidth - scaledLeft.width) / 2;
      const xRight = (pageWidth - scaledRight.width) / 2;

      mergedCtx.drawImage(scaledLeft, xLeft, verticalMargin);
      mergedCtx.drawImage(
        scaledRight,
        xRight,
        verticalMargin + scaledLeft.height + objectGap
      );

      const mergedImage = mergedCanvas.toDataURL("image/png");

      // Create PDF with merged image
      const newPdf = await PDFDocument.create();
      const embeddedImage = await newPdf.embedPng(mergedImage);
      const page = newPdf.addPage([pageWidth, totalHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });

      const pdfData = await newPdf.saveAsBase64({ dataUri: true });
      return { pdfData, imageData: mergedImage }; // Return both PDF and image data
    } catch (err) {
      console.log(err);
      alert("Error during PDF processing.");
    }
  };

  const pdfToImage = async (fileBuffer, pageNumber) => {
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    return await loadImage(canvas.toDataURL());
  };

  const detectDashedLine = async (canvas) => {
    const imageData = canvas.toDataURL();

    const {
      data: { text },
    } = await Tesseract.recognize(imageData, "eng", {
      logger: (m) => null,
    });

    const dashedLinePattern = /----/g;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (dashedLinePattern.test(lines[i])) {
        const estimatedY = (i / lines.length) * canvas.height;
        return estimatedY;
      }
    }

    return canvas.height * 0.675; // Default if no dashed line found
  };

  const detectCutLines = async (canvas, cutLineY) => {
    const verticalCutX = canvas.width / 2;

    return [
      {
        x: 0,
        y: cutLineY,
        width: canvas.width,
        height: canvas.height - cutLineY,
      },
      {
        x: 0,
        y: cutLineY,
        width: verticalCutX,
        height: canvas.height - cutLineY,
      },
      {
        x: verticalCutX,
        y: cutLineY,
        width: canvas.width - verticalCutX,
        height: canvas.height - cutLineY,
      },
    ];
  };

  const cropImage = (canvas, x, y, width, height) => {
    const croppedCanvas = createCanvas(width, height);
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

    // Remove 3px from each side of the cropped image
    const croppedWithMarginCanvas = createCanvas(width - 12, height);
    const croppedWithMarginCtx = croppedWithMarginCanvas.getContext("2d");
    croppedWithMarginCtx.drawImage(
      croppedCanvas,
      6,
      0,
      width - 12,
      height,
      0,
      0,
      width - 12,
      height
    );

    return croppedWithMarginCanvas;
  };

  const trimWhiteSpace = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let top = canvas.height,
      left = canvas.width,
      bottom = 0,
      right = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const alpha = imageData.data[index + 3];

        if (r < 240 || g < 240 || b < 240 || alpha < 255) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    const trimmedCanvas = createCanvas(right - left, bottom - top);
    const trimmedCtx = trimmedCanvas.getContext("2d");
    trimmedCtx.drawImage(
      canvas,
      left,
      top,
      right - left,
      bottom - top,
      0,
      0,
      right - left,
      bottom - top
    );

    return trimmedCanvas;
  };

  const increaseResolution = (canvas) => {
    const scaleFactor = 2;
    const highResCanvas = createCanvas(
      canvas.width * scaleFactor,
      canvas.height * scaleFactor
    );
    const highResCtx = highResCanvas.getContext("2d");

    highResCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width * scaleFactor,
      canvas.height * scaleFactor
    );

    return highResCanvas;
  };

  const scaleToFit = (
    canvas,
    pageWidth,
    pageHeight,
    verticalMargin,
    horizontalMargin
  ) => {
    const widthScale = (pageWidth - 2 * horizontalMargin) / canvas.width;
    const heightScale = (pageHeight - 2 * verticalMargin) / canvas.height;
    const scale = Math.min(widthScale, heightScale);

    const scaledCanvas = createCanvas(
      canvas.width * scale,
      canvas.height * scale
    );
    const scaledCtx = scaledCanvas.getContext("2d");

    scaledCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width * scale,
      canvas.height * scale
    );

    return scaledCanvas;
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <main className="flex justify-center pt-20 pb-5 h-screen">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-12 items-center">
        <div className="flex flex-col gap-3">
            <h1 className="text-[2rem] font-bold text-gray-500 leading-[24px] tracking-[1px]">
              PDF File Automation
            </h1>
            <label htmlFor="fileID">
              <input
                type="file"
                id="fileID"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex justify-center w-auto">
                <p className="cursor-pointer rounded-full px-10 py-5 bg-blue-600 text-white font-semibold leading-5 text-[1.2rem]">
                  Click to Upload PDF
                </p>
              </div>
            </label>
        </div>
        {isLoading && (
          <div style={{ margin: "5vh" }}>
            <StarLoader size={55} />
          </div>
        )}

        {(processedFile && !isLoading) && (
          <div className="flex flex-col gap-y-12">
            <div className="flex flex-col items-center gap-y-3">
              <SuccessAnimation isVisible={true} />

              <PreviewButton action={() => setShowModal(true)} />
            </div>

            <div className="flex flex-col gap-y-3 items-center">
              <div className="flex items-center gap-x-2">
                <label
                  htmlFor="HeadlineAct"
                  className="block text-sm font-medium text-gray-900 leading-[23px] tracking-[0.5px]"
                >
                  Export as:
                </label>

                <div className="relative">
                  <select
                    className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none transition duration-200 ease-in-out"
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p
                className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500 cursor-pointer"
                onClick={handleDownload}
              >
                Download
              </p>
            </div>
          </div>
        )}

        <FilePreviewModal
          processedFile={processedFile}
          isVisible={showModal}
          onClose={closeModal}
        />
      </div>
    </main>
  );
}

export default App;
