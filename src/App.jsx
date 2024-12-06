import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import StarLoader from "./components/loaders/StarLoader";
import SuccessAnimation from "./components/loaders/SuccessAnimation";
import PreviewButton from "./components/buttons/PreviewButton";
import FilePreviewModal from "./components/modals/FilePreviewModal";
import { processPdf } from "./utils/processPDF";
import PDFSplitter from "./components/PdfSplitter";
import UnlockPDF from "./components/UnlockPDF";

// Set the worker source to the local path
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function App() {

  return (
    <>
      

      <PDFSplitter />


{/* <UnlockPDF/> */}


    </>
  );
}

export default App;
