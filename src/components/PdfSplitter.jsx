/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import FilePreviewModal from "./modals/FilePreviewModal";
import PreviewButton from "./buttons/PreviewButton";
import SuccessAnimation from "./loaders/SuccessAnimation";
import StarLoader from "./loaders/StarLoader";
import { checkIfPdfIsLocked } from "../utils/checkIfPdfIsLocked";
import { splitPDF } from "../utils/splitPDF";
import { convertPdfToImage } from "../utils/convertPdfToImage";
import { splitPANCard } from "../utils/SplitPANCard";
import { splitVotersCard } from "../utils/splitVotersCard";
import { splitAyushman } from "../utils/splitAyushman";
import { CloudIcon } from "./svg_icons";
import { Button, Input, Select } from "antd";
import { useMessage } from "../hooks/useMessage";

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
  const [docName, setDocName] = useState("");

  const { showMessage, contextHolder } = useMessage();

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = () => setArrayBuffer(reader.result);
      reader.readAsArrayBuffer(file);
      checkIfPdfIsLocked(file, setIsLocked, showMessage);
    }
  };

  const paramPasser = async (arrayBuffer, setPdfPreviewUrl, setIsLoading) => {
    switch (docName) {
      case "ID_CARD":
        return await splitPDF(arrayBuffer, setPdfPreviewUrl, setIsLoading);
      case "PAN_CARD":
        return await splitPANCard(arrayBuffer, setPdfPreviewUrl, setIsLoading);
      case "VOTERS_CARD":
        return await splitVotersCard(
          arrayBuffer,
          setPdfPreviewUrl,
          setIsLoading
        );
      case "AYUSHMAN_CARD":
        return await splitAyushman(arrayBuffer, setPdfPreviewUrl, setIsLoading);
      default:
        return await splitPDF(arrayBuffer, setPdfPreviewUrl, setIsLoading);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const processPDF = async () => {
    if (!pdfFile) {
      showMessage("error", "Please upload your file");
      return;
    }
    if (isLocked && !pdfPassword) {
      showMessage("error", "Please Enter your Document password.");
      return;
    }
    if (!docName) {
      showMessage("error", "Please Select the Name of your Document");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("password", pdfPassword);

    setIsLoading(true);
    try {
      let newPdfDoc = null;
      if (isLocked) {
        // https://unlock-pdf-1.onrender.com/
        const response = await fetch(
          "https://unlock-pdf-1.onrender.com/unlock-pdf",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        // Create a blob from the response and load it into pdf-lib
        const responseBlob = await response.blob();
        const arrayBuffer = await responseBlob.arrayBuffer();
        setArrayBuffer(arrayBuffer);

        // splitPDF(arrayBuffer, setPdfPreviewUrl, setIsLoading);
        newPdfDoc = await paramPasser(
          arrayBuffer,
          setPdfPreviewUrl,
          setIsLoading
        );
        // await delay(100);
      } else {
        // This one uses the arrayBuffer stored in the state
        newPdfDoc = await paramPasser(
          arrayBuffer,
          setPdfPreviewUrl,
          setIsLoading
        );
      }
      const newPdfBytes = await newPdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const previewUrl = URL.createObjectURL(blob);

      setPdfPreviewUrl(previewUrl);

      setIsLoading(false);

      setShowModal(true);
    } catch (error) {
      showMessage("error", error);
      console.log(error);
    } finally {
      setIsLoading(false);
      setDocName("")
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
      link.download = `cropped-${pdfFile?.name}.pdf`;
      link.click();
    } else if (downloadFormat === "image" && pdfPreviewUrl) {
      let imageUrl = await convertPdfToImage(pdfPreviewUrl, showMessage);
      const link = document.createElement("a");

      // Set the href to the base64 string
      link.href = imageUrl;

      // Set the download attribute with the desired file name
      link.download = `cropped-${pdfFile?.name}.png`;

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
      <main className="bg-[#e1e1e2]">
        <section className="w-full md:w-3/6 mx-auto px-4 min-h-screen flex justify-center items-center">
          <div className="bg-white w-full rounded-[25px] pb-5">
            <div className="px-8 py-3 flex gap-x-5 items-center">
              <div className="p-3 border-2 rounded-full border-[#CBD0DC]">
                <CloudIcon />
              </div>
              <div>
                <h3 className="font-semibold tracking-wide text-[25px]">
                  File Cropping
                </h3>
                <p className="text-[#A9ACB4] tracking-wide font-medium text-[18px]">
                  Select and upload the files of your choice
                </p>
              </div>
            </div>
            <div>
              <hr className="h-[2px] bg-[#CBD0DC] border-0"></hr>
            </div>
            <div className="px-8 py-5">
              <div className="border-[2.5px] border-dashed border-[#CBD0DC] rounded-[8px] pb-8">
                <div className="flex justify-end mx-3 mt-3">
                  <Select
                    size="large"
                    placeholder={"Select Document Name"}
                    style={{
                      minWidth: 150,
                    }}
                    onChange={(value) => setDocName(value)}
                    options={[
                      { value: "ID_CARD", label: "ID CARD" },
                      { value: "PAN_CARD", label: "PAN CARD" },
                      { value: "VOTERS_CARD", label: "VOTERS CARD" },
                      { value: "AYUSHMAN_CARD", label: "AYUSHMAN CARD" },
                    ]}
                  />
                </div>
                <div className="flex justify-center items-center text-center pt-3 pb-10 flex-col gap-y-4">
                  <CloudIcon size={30} />
                  <div>
                    <h4 className="font-medium">Choose a file here</h4>
                    <p className="text-[#A9ACB4]">
                      PDF format is only accepted
                    </p>
                  </div>
                  <label htmlFor="fileID">
                    <input
                      type="file"
                      ref={fileInputRef}
                      id="fileID"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="file:p-1 hover:file:cursor-pointer hidden"
                    />
                    <div className="border-[1.5px] text-[#54575C] border-[#CBD0DC] rounded-lg px-4 py-2 cursor-pointer">
                      Browse File
                    </div>
                  </label>

                  {pdfFile && (
                    <p className="font-medium tracking-wide">
                      File Selected:{" "}
                      <span className="text-[#9699a1]">{pdfFile.name}</span>
                    </p>
                  )}
                  {isLocked && (
                    <div className="mb-3">
                      <Input.Password
                        type="password"
                        size="large"
                        style={{
                          width: "120",
                        }}
                        placeholder="Enter File Password"
                        onChange={(e) => setPdfPassword(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center w-auto">
                  <Button
                    type="primary"
                    size="large"
                    onClick={processPDF}
                    loading={isLoading}
                    // disabled={isLocked && !pdfPassword}
                  >
                    Click to Upload PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {contextHolder}
      </main>

      <FilePreviewModal
        processedFile={pdfPreviewUrl}
        isVisible={showModal}
        onClose={closeModal}
        handleDownload={handleDownload}
        setDownloadFormat={setDownloadFormat}
        downloadFormat={downloadFormat}
      />
    </>
  );
};

export default PDFSplitter;
