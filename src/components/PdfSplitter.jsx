/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import FilePreviewModal from "./modals/FilePreviewModal";
import PreviewButton from "./buttons/PreviewButton";
import SuccessAnimation from "./loaders/SuccessAnimation";
import StarLoader from "./loaders/StarLoader";
import { checkIfPdfIsLocked } from "../utils/checkIfPdfIsLocked";
import { splitPDF } from "../utils/splitPDF";
import { convertPdfToImage } from "../utils/convertPdfToImage";

// Set the worker globally
// GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.min.js`;

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDFSplitter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfPassword, setPdfPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [arrayBuffer, setArrayBuffer] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = () => setArrayBuffer(reader.result);
      reader.readAsArrayBuffer(file);
      checkIfPdfIsLocked(file, setIsLocked);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const processPDF = async () => {
    if (!pdfFile || (isLocked && !pdfPassword)) {
      alert("Please upload a file and enter a password.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("password", pdfPassword);

    setIsLoading(true);
    try {
      if (isLocked) {
        // https://unlock-pdf-1.onrender.com/
        const response = await fetch("https://unlock-pdf-1.onrender.com/unlock-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        // Create a blob from the response and load it into pdf-lib
        const responseBlob = await response.blob();
        const arrayBuffer = await responseBlob.arrayBuffer();
        setArrayBuffer(arrayBuffer);

        splitPDF(arrayBuffer, setPdfPreviewUrl, setIsLoading);
      } else {
        splitPDF(arrayBuffer, setPdfPreviewUrl, setIsLoading);
        
      }
    } catch (error) {
      alert(error)
      console.log(error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
      setPdfPassword("");
    }
  };

  const handleDownload = async () => {
    if (downloadFormat === "pdf" && pdfPreviewUrl) {
      const link = document.createElement("a");
      link.href = pdfPreviewUrl;
      link.download = "processed-file.pdf";
      link.click();
    } else if (downloadFormat === "image" && pdfPreviewUrl) {
      let imageUrl = await convertPdfToImage(pdfPreviewUrl);
      const link = document.createElement("a");

      // Set the href to the base64 string
      link.href = imageUrl;

      // Set the download attribute with the desired file name
      link.download = "processed-image.png";

      // Append the link to the document body (required for Firefox)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link after downloading
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <main className="w-full md:w-5/6 mx-auto px-4 pt-20 h-screen">
        {/* <div className="w-full max-w-lg mx-auto flex flex-col gap-12 items-cente"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          <div>
            <div className="flex flex-col gap-4">
              <h1 className="text-[2rem] font-bold text-gray-700 leading-[30px] tracking-[1px]">
                Automate Your PDFs
              </h1>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                onChange={handleFileUpload}
                className="file:p-1 hover:file:cursor-pointer"
              />
              {isLocked && (
                <div className="">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PDF File Password{" "}
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    value={pdfPassword}
                    placeholder="Enter File Password"
                    onChange={(e) => setPdfPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-400 p-3 bg-white text-sm text-gray-700 shadow-sm"
                  />
                </div>
              )}
                <div className="flex justify-start w-auto">
                  <button onClick={processPDF} className="cursor-pointer rounded px-8 py-4 bg-blue-600 text-white font-semibold leading-5 text-[1.2rem]">
                    Click to Upload PDF
                  </button>
                </div>
            </div>
          </div>
          <div className="flex justify-center items-center min-h-80">
            {isLoading ? (
              <div style={{ margin: "5vh" }}>
                <StarLoader size={55} />
              </div>
            ) : null}

            {pdfPreviewUrl && !isLoading && (
              <div className="flex flex-col gap-y-12 pb-4">
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
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p
                    className="inline-block rounded bg-blue-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-blue-500 cursor-pointer"
                    onClick={handleDownload}
                  >
                    Download
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* </div> */}
        <FilePreviewModal
          processedFile={pdfPreviewUrl}
          isVisible={showModal}
          onClose={closeModal}
        />
      </main>
    </>
  );
};

export default PDFSplitter;
