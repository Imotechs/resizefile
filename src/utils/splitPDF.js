import { PDFDocument } from "pdf-lib";

export const splitPDF = async(arrayBuffer, setPdfPreviewUrl,
    setIsLoading)=>{
    const pdfDoc = await PDFDocument.load(arrayBuffer);

      const newPdfDoc = await PDFDocument.create();
      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();

      // Define the original regions (use full width and a portion of the height)
      const bottomLeftRegion = {
        x: 0,
        y: 0,
        width: width / 2 - 4, // Full width
        height: height * 0.325, // Half the height
      };

      const bottomRightRegion = {
        x: width / 2 + 3, // Position to the right
        y: 0,
        width: width / 2, // Full width
        height: height * 0.325, // Half the height
      };

      // Embed the regions
      const embedRegion = async (region) => {
        try {
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
        } catch (error) {
          console.error("Error embedding region:", error);
          throw error;
        }
      };

      const bottomLeftEmbedded = await embedRegion(bottomLeftRegion);
      const bottomRightEmbedded = await embedRegion(bottomRightRegion);

      // A4 page dimensions
      const A4_WIDTH = 595.28;
      const A4_HEIGHT = 841.89;
      const MARGIN_LEFT_RIGHT = 40;
      const MARGIN_TOP_BOTTOM = 80;

      // Define available space for regions (excluding margins)
      const availableWidth = A4_WIDTH - 2 * MARGIN_LEFT_RIGHT;
      const availableHeight = A4_HEIGHT - 2 * MARGIN_TOP_BOTTOM;

      // Scale regions to fit within the available space
      const scaleFactorWidth = availableWidth / width; // Scale based on full width
      const scaleFactorHeight = availableHeight / (height * 0.65); // Scale based on region height (adjust to fit in A4)

      const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight); // Use the smaller of the two to maintain aspect ratio

      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * 0.65 * scaleFactor; // Use the region height scaled

      // Create a new page in the new PDF
      const newPage = newPdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);


      // Position the bottom left region (at the top of the page)
      newPage.drawPage(bottomLeftEmbedded, {
        x: 15,
        y: A4_HEIGHT - MARGIN_TOP_BOTTOM - scaledHeight, // Start from the top margin
        width: scaledWidth,
        height: scaledHeight,
      });

      // Position the bottom right region (below the bottom left region)
      newPage.drawPage(bottomRightEmbedded, {
        x: 73,
        y: -20, //A4_HEIGHT - scaledHeight, // Place below with a gap
        width: scaledWidth,
        height: scaledHeight,
      });

      // Save the new PDF
      const newPdfBytes = await newPdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const previewUrl = await URL.createObjectURL(blob);

      setPdfPreviewUrl(previewUrl);

      setIsLoading(false);
      
  }