
import * as pdfjsLib from "pdfjs-dist";
import PDFSplitter from "./components/PdfSplitter";

// Set the worker source to the local path
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function App() {

  return (
    <>
      

      <PDFSplitter />


    </>
  );
}

export default App;
