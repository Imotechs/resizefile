import Tesseract from "tesseract.js";

export const detectDashedLine = async (canvas) => {
    const imageData = canvas.toDataURL();

    const {
      data: { text },
    } = await Tesseract.recognize(imageData, "eng", {
      logger: (m) => null,
    });

    const dashedLinePattern = /----/g;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (dashedLinePattern.test(lines[i])) {
        const estimatedY = (i / lines.length) * canvas.height;
        return estimatedY;
      }
    }

    return canvas.height * 0.675; // Default if no dashed line found
  };