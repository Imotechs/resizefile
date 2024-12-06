import { createCanvas } from "canvas";

export const scaleToFit = (
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