import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import StarLoader from "./components/loaders/StarLoader";
import SuccessAnimation from "./components/loaders/SuccessAnimation";
import PreviewButton from "./components/buttons/PreviewButton";
import FilePreviewModal from "./components/modals/FilePreviewModal";
import { processPdf } from "./utils/processPDF";

// Set the worker source to the local path
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

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

        {processedFile && !isLoading && (
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
