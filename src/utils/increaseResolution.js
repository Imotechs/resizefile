import { createCanvas } from "canvas";

export const increaseResolution = (canvas) => {
    const scaleFactor = 2;
    const highResCanvas = createCanvas(
      canvas.width * scaleFactor,
      canvas.height * scaleFactor
    );
    const highResCtx = highResCanvas.getContext("2d");

    highResCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width * scaleFactor,
      canvas.height * scaleFactor
    );

    return highResCanvas;
  };