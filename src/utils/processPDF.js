import { createCanvas } from "canvas";
import { pdfToImage } from "./pdfToImage";
import { enhanceImageQuality } from "./enhanceImageQuality";
import { detectDashedLine } from "./detectDashedLine";
import { detectCutLines } from "./detectCutLines";
import { trimWhiteSpace } from "./trimWhiteSpace";
import { cropImage } from "./cropImage";
import { increaseResolution } from "./increaseResolution";
import { scaleToFit } from "./scaleToFit";
import { PDFDocument } from "pdf-lib";

export const processPdf = async (fileBuffer) => {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const pageImage = await pdfToImage(fileBuffer, 1);
      const canvas = createCanvas(pageImage.width, pageImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(pageImage, 0, 0);

      // Enhance image quality
      enhanceImageQuality(canvas);

      // Continue with the rest of your logic...
      const cutLineY = await detectDashedLine(canvas);
      const cutRegions = await detectCutLines(canvas, cutLineY);

      const croppedLeft = cropImage(
        canvas,
        cutRegions[1].x,
        cutRegions[1].y,
        cutRegions[1].width,
        cutRegions[1].height
      );
      const croppedRight = cropImage(
        canvas,
        cutRegions[2].x,
        cutRegions[2].y,
        cutRegions[2].width,
        cutRegions[2].height
      );

      const trimmedLeft = trimWhiteSpace(croppedLeft);
      const trimmedRight = trimWhiteSpace(croppedRight);

      const highResLeft = increaseResolution(trimmedLeft);
      const highResRight = increaseResolution(trimmedRight);

      const verticalMargin = 60;
      const horizontalMargin = 40;
      const pageWidth = 595;
      const pageHeight = 842;
      const objectGap = 15;

      const scaledLeft = scaleToFit(
        highResLeft,
        pageWidth,
        pageHeight,
        verticalMargin,
        horizontalMargin
      );
      const scaledRight = scaleToFit(
        highResRight,
        pageWidth,
        pageHeight,
        verticalMargin,
        horizontalMargin
      );

      const totalHeight =
        scaledLeft.height + scaledRight.height + objectGap + verticalMargin * 2;

      const mergedCanvas = createCanvas(pageWidth, totalHeight);
      const mergedCtx = mergedCanvas.getContext("2d");

      const xLeft = (pageWidth - scaledLeft.width) / 2;
      const xRight = (pageWidth - scaledRight.width) / 2;

      mergedCtx.drawImage(scaledLeft, xLeft, verticalMargin);
      mergedCtx.drawImage(
        scaledRight,
        xRight,
        verticalMargin + scaledLeft.height + objectGap
      );

      const mergedImage = mergedCanvas.toDataURL("image/png");

      // Create PDF with merged image
      const newPdf = await PDFDocument.create();
      const embeddedImage = await newPdf.embedPng(mergedImage);
      const page = newPdf.addPage([pageWidth, totalHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });

      const pdfData = await newPdf.saveAsBase64({ dataUri: true });
      return { pdfData, imageData: mergedImage }; // Return both PDF and image data
    } catch (err) {
      console.log(err);
      alert("Error during PDF processing.");
    }
  };