export const processPdf = async (fileBuffer) => {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
  
      const testScales = [1, 2, 3]; // Example scales for DPI testing
      let bestCanvas = null;
  
      for (let scale of testScales) {
        console.log(`Testing DPI with scale: ${scale}`);
        const pageImage = await pdfToImage(fileBuffer, 1, scale);
  
        const canvas = createCanvas(pageImage.width, pageImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(pageImage, 0, 0);
  
        // Optionally, apply enhancements and evaluate quality
        enhanceImageQuality(canvas);
  
        // For now, pick the first canvas as "best" (you can add logic to evaluate quality)
        if (!bestCanvas) {
          bestCanvas = canvas;
        }
      }
  
      const enhancedCanvas = bestCanvas;
  
      // Proceed with your cutting and processing logic
      const cutLineY = await detectDashedLine(enhancedCanvas);
      const cutRegions = await detectCutLines(enhancedCanvas, cutLineY);
  
      const croppedLeft = cropImage(
        enhancedCanvas,
        cutRegions[1].x,
        cutRegions[1].y,
        cutRegions[1].width,
        cutRegions[1].height
      );
      const croppedRight = cropImage(
        enhancedCanvas,
        cutRegions[2].x,
        cutRegions[2].y,
        cutRegions[2].width,
        cutRegions[2].height
      );
  
      // Trim, scale, and merge as in your existing logic...
      // (Rest of your processPdf function)
  
      return await mergedPdf.saveAsBase64({ dataUri: true });
    } catch (err) {
      console.error(err);
      alert("Error during PDF processing.");
    }
  };
  