import { degrees, PDFDocument } from "pdf-lib";

export const splitAyushman = async (arrayBuffer) => {
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdfDoc = await PDFDocument.create();

  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

  // Define regions
  const leftRegion = {
    x: 0,
    y: 0,
    width: width * 0.23, // Left 23% of the page
    height,
  };

  const topLeftRegion = {
    x: leftRegion.x,
    y: leftRegion.y + height / 2,
    width: leftRegion.width,
    height: height / 2,
  };

  const bottomLeftRegion = {
    x: leftRegion.x,
    y: leftRegion.y,
    width: leftRegion.width,
    height: height / 2,
  };

  const embedRegion = async (region) => {
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
  };

  // Embed regions
  const topLeftEmbedded = await embedRegion(topLeftRegion);
  const bottomLeftEmbedded = await embedRegion(bottomLeftRegion);

  // Define A4 dimensions and margins
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 60;

  // Scale factor
  const scaleFactor = Math.min(
    (A4_WIDTH - 2 * MARGIN) / (width / 2),
    (A4_HEIGHT - 2 * MARGIN) / leftRegion.height
  );

  const scaledWidth = width * 0.5 * scaleFactor;
  const scaledHeight = leftRegion.height * scaleFactor;

  // Add new page
  const newPage = newPdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // Draw top-left region (rotated upright)
  newPage.drawPage(topLeftEmbedded, {
    x: 0,
    y: 620,
    width: scaledWidth,
    height: scaledHeight,
    rotate: degrees(-90),
  });

  // Draw bottom-left region (rotated upright)
  newPage.drawPage(bottomLeftEmbedded, {
    x: -141,
    y: 930,
    width: scaledWidth,
    height: scaledHeight,
    rotate: degrees(-90),
  });

  return newPdfDoc;
};
