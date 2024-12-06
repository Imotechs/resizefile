import { createCanvas } from "canvas";

export const trimWhiteSpace = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let top = canvas.height,
      left = canvas.width,
      bottom = 0,
      right = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const alpha = imageData.data[index + 3];

        if (r < 240 || g < 240 || b < 240 || alpha < 255) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    const trimmedCanvas = createCanvas(right - left, bottom - top);
    const trimmedCtx = trimmedCanvas.getContext("2d");
    trimmedCtx.drawImage(
      canvas,
      left,
      top,
      right - left,
      bottom - top,
      0,
      0,
      right - left,
      bottom - top
    );

    return trimmedCanvas;
  };