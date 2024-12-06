export const detectCutLines = async (canvas, cutLineY) => {
    const verticalCutX = canvas.width / 2;

    return [
      {
        x: 0,
        y: cutLineY,
        width: canvas.width,
        height: canvas.height - cutLineY,
      },
      {
        x: 0,
        y: cutLineY,
        width: verticalCutX,
        height: canvas.height - cutLineY,
      },
      {
        x: verticalCutX,
        y: cutLineY,
        width: canvas.width - verticalCutX,
        height: canvas.height - cutLineY,
      },
    ];
  };
