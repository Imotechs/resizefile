import * as pdfjsLib from "pdfjs-dist";

export const convertPdfToImage = async (pdfPreviewUrl, showMessage) => {
    if (!pdfPreviewUrl) return showMessage("error", "Please generate a preview PDF first!");

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
    const imageUrl = canvas.toDataURL("image/png");
    return imageUrl;
  };