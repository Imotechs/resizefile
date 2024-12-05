export const applyConvolutionFilter = (imageData, kernel) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
  
    const kernelSize = Math.sqrt(kernel.length);
    const halfKernel = Math.floor(kernelSize / 2);
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
  
        let r = 0, g = 0, b = 0;
        for (let ky = -halfKernel; ky <= halfKernel; ky++) {
          for (let kx = -halfKernel; kx <= halfKernel; kx++) {
            const xSample = Math.min(width - 1, Math.max(0, x + kx));
            const ySample = Math.min(height - 1, Math.max(0, y + ky));
            const sampleIndex = (ySample * width + xSample) * 4;
  
            const kernelValue = kernel[(ky + halfKernel) * kernelSize + (kx + halfKernel)];
            r += tempData[sampleIndex] * kernelValue;
            g += tempData[sampleIndex + 1] * kernelValue;
            b += tempData[sampleIndex + 2] * kernelValue;
          }
        }
        data[pixelIndex] = truncate(r);
        data[pixelIndex + 1] = truncate(g);
        data[pixelIndex + 2] = truncate(b);
      }
    }
  };
  
  const truncate = (value) => Math.min(255, Math.max(0, value));
  