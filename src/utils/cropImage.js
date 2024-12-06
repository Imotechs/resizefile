import { createCanvas } from "canvas";

export const cropImage = (canvas, x, y, width, height) => {
    const croppedCanvas = createCanvas(width, height);
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

    // Remove 3px from each side of the cropped image
    const croppedWithMarginCanvas = createCanvas(width - 12, height);
    const croppedWithMarginCtx = croppedWithMarginCanvas.getContext("2d");
    croppedWithMarginCtx.drawImage(
      croppedCanvas,
      6,
      0,
      width - 12,
      height,
      0,
      0,
      width - 12,
      height
    );

    return croppedWithMarginCanvas;
  };