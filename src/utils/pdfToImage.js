import { createCanvas, loadImage } from "canvas";

export const pdfToImage = async (fileBuffer, pageNumber) => {
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