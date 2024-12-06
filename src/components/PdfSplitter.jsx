import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import FilePreviewModal from "./modals/FilePreviewModal";
import PreviewButton from "./buttons/PreviewButton";
import SuccessAnimation from "./loaders/SuccessAnimation";
import StarLoader from "./loaders/StarLoader";

const PDFSplitter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPdfFile(reader.result);
      reader.readAsArrayBuffer(file);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const splitPDF = async () => {
    if (!pdfFile) return alert("Please upload a PDF first!");

    setIsLoading(true);

    const pdfDoc = await PDFDocument.load(pdfFile);
    const newPdfDoc = await PDFDocument.create();
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Define the original regions (use full width and a portion of the height)
    const bottomLeftRegion = {
      x: 0,
      y: 0,
      width: width / 2 - 4, // Full width
      height: height * 0.325, // Half the height
    };

    const bottomRightRegion = {
      x: width / 2 + 3, // Position to the right
      y: 0,
      width: width / 2, // Full width
      height: height * 0.325, // Half the height
    };

    // Embed the regions
    const embedRegion = async (region) => {
      try {
        const embeddedPages = await newPdfDoc.embedPages(
          [firstPage],
          [
            {
              left: region.x,
              bottom: region.y,
              right: region.x + region.width,
              top: region.y + region.height,
            },
          ]
        );
        return embeddedPages[0];
      } catch (error) {
        console.error("Error embedding region:", error);
        throw error;
      }
    };

    const bottomLeftEmbedded = await embedRegion(bottomLeftRegion);
    const bottomRightEmbedded = await embedRegion(bottomRightRegion);

    // A4 page dimensions
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    const MARGIN_LEFT_RIGHT = 40;
    const MARGIN_TOP_BOTTOM = 80;

    // Define available space for regions (excluding margins)
    const availableWidth = A4_WIDTH - 2 * MARGIN_LEFT_RIGHT;
    const availableHeight = A4_HEIGHT - 2 * MARGIN_TOP_BOTTOM;

    // Scale regions to fit within the available space
    const scaleFactorWidth = availableWidth / width; // Scale based on full width
    const scaleFactorHeight = availableHeight / (height * 0.65); // Scale based on region height (adjust to fit in A4)

    const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight); // Use the smaller of the two to maintain aspect ratio

    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * 0.65 * scaleFactor; // Use the region height scaled

    // Create a new page in the new PDF
    const newPage = newPdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    console.log(MARGIN_LEFT_RIGHT);

    // Position the bottom left region (at the top of the page)
    newPage.drawPage(bottomLeftEmbedded, {
      x: 15,
      y: A4_HEIGHT - MARGIN_TOP_BOTTOM - scaledHeight, // Start from the top margin
      width: scaledWidth,
      height: scaledHeight,
    });

    // Position the bottom right region (below the bottom left region)
    newPage.drawPage(bottomRightEmbedded, {
      x: 73,
      y: -20, //A4_HEIGHT - scaledHeight, // Place below with a gap
      width: scaledWidth,
      height: scaledHeight,
    });

    // Save the new PDF
    const newPdfBytes = await newPdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    const previewUrl = await URL.createObjectURL(blob);

    setPdfPreviewUrl(previewUrl);

    console.log("PDF generated successfully!");

    setIsLoading(false);
  };

  const convertPdfToImage = async () => {
    if (!pdfPreviewUrl) return alert("Please generate a preview PDF first!");

    // Load the PDF using pdfjs-dist
    const loadingTask = pdfjsLib.getDocument(pdfPreviewUrl);
    const pdf = await loadingTask.promise;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const page = await pdf.getPage(1); // Get the first page
    const viewport = page.getViewport({ scale: 1 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert canvas to an image
    const imageUrl = await canvas.toDataURL("image/png");
    console.log(imageUrl);
    return imageUrl;
    // setImageUrls((prev) => [...prev, imageUrl]);
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

      <main className="flex justify-center pt-20 pb-5 h-screen">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-[2rem] font-bold text-gray-700 leading-[24px] tracking-[1px]">
              Automate Your PDFs
            </h1>
            <input
                type="file"
                id="fileID"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="file:p-2 hover:file:cursor-pointer"
              />
            <div onClick={splitPDF}>
              <div className="flex justify-center w-auto">
                <p className="cursor-pointer rounded-full px-8 py-3 bg-blue-600 text-white font-semibold leading-5 text-[1.2rem]">
                  Click to Upload PDF
                </p>
              </div>
            </div>
          </div>
          {/* <button onClick={splitPDF}>Upload</button> */}
          {isLoading && (
            <div style={{ margin: "5vh" }}>
              <StarLoader size={55} />
            </div>
          )}

          {pdfPreviewUrl && !isLoading && (
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
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
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
            processedFile={pdfPreviewUrl}
            isVisible={showModal}
            onClose={closeModal}
          />
        </div>
      </main>
    </>
  );
};

export default PDFSplitter;