export const pdfToImage = async (fileBuffer, pageNumber, scale = 2) => {
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    const page = await pdf.getPage(pageNumber);
  
    // Use the scale to adjust DPI
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");
  
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
  
    await page.render(renderContext).promise;
  
    return await loadImage(canvas.toDataURL());
  };
  