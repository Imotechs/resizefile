import { applyConvolutionFilter } from "./applyConvolutionFilter";

export const enhanceImageQuality = (canvas) => {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Slightly increase saturation
  const saturationFactor = 1.1; // Subtle enhancement
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to HSL, increase saturation, and convert back to RGB
    const [h, s, l] = rgbToHsl(r, g, b);
    const [newR, newG, newB] = hslToRgb(h, s * saturationFactor, l);

    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }

  // Apply milder sharpening kernel
  const sharpenMatrix = [
    0, -0.5, 0,
    -0.5, 3, -0.5,
    0, -0.5, 0,
  ];
  applyConvolutionFilter(imageData, sharpenMatrix);

  // Optional: Adjust contrast
  adjustContrast(imageData, 1.05); // Fine-tune as needed

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// Helper function to adjust contrast
const adjustContrast = (imageData, contrastFactor) => {
  const data = imageData.data;
  const factor = (259 * (contrastFactor + 255)) / (255 * (259 - contrastFactor));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = truncate(factor * (data[i] - 128) + 128); // Red
    data[i + 1] = truncate(factor * (data[i + 1] - 128) + 128); // Green
    data[i + 2] = truncate(factor * (data[i + 2] - 128) + 128); // Blue
  }
};

// Helper function to truncate values
const truncate = (value) => Math.min(255, Math.max(0, value));

// Helper function to convert RGB to HSL
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l]; // No saturation
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) :
            max === g ? (b - r) / d + 2 :
                        (r - g) / d + 4;
  return [h * 60, s, l];
};

// Helper function to convert HSL back to RGB
const hslToRgb = (h, s, l) => {
  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hueToRgb(p, q, h / 360 + 1 / 3);
  const g = hueToRgb(p, q, h / 360);
  const b = hueToRgb(p, q, h / 360 - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
