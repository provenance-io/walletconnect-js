import QRCode from 'qrcode';
import figureLogo from '../../../images/figure.svg';

export const createQRImage = (qrData: string): Promise<string> =>
  new Promise((resolve) => {
    const qrCodeCanvas = document.createElement('canvas');
    const QR_CODE_SIZE = 276;
    QRCode.toCanvas(qrCodeCanvas, qrData, {
      width: QR_CODE_SIZE * window.devicePixelRatio,
    }).then(() => {
      // Update size of qrCodeCanvas (for resolution)
      // Create a new canvas to combine qr + figure logo
      const finalCanvas = document.createElement('canvas');
      // Setting "as" since we know it will exist
      const ctx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
      // Adjust the size of the canvas based on devicePixelRatio
      const PIXEL_RATIO = window.devicePixelRatio; // What pixel ratio is the screen using
      finalCanvas.width = qrCodeCanvas.width;
      finalCanvas.height = qrCodeCanvas.height;
      finalCanvas.style.width = `${QR_CODE_SIZE}px`;
      finalCanvas.style.height = `${QR_CODE_SIZE}px`;
      // Add in the qr image canvas to the finalCanvas
      ctx.drawImage(qrCodeCanvas, 0, 0);
      // Draw "F" in center of QRCode
      // Draw white square for "F" to sit in
      ctx.fillStyle = 'white';
      // Add a border to the square
      const BG_SQUARE_SIZE = 60 * PIXEL_RATIO; // Rectangle (same width & height)
      const BG_SQUARE_X = (QR_CODE_SIZE * PIXEL_RATIO) / 2 - BG_SQUARE_SIZE / 2;
      const BG_SQUARE_Y = (QR_CODE_SIZE * PIXEL_RATIO) / 2 - BG_SQUARE_SIZE / 2;
      ctx.fillRect(BG_SQUARE_X, BG_SQUARE_Y, BG_SQUARE_SIZE, BG_SQUARE_SIZE);
      // Draw Figure "F" in the center
      const centerLogo = new Image();
      centerLogo.src = figureLogo;
      centerLogo.onload = () => {
        const LOGO_WIDTH = 24.5 * PIXEL_RATIO;
        const LOGO_HEIGHT = 40 * PIXEL_RATIO;
        // Combine qrcode img with logo image in center
        ctx.drawImage(
          centerLogo,
          (QR_CODE_SIZE * PIXEL_RATIO) / 2 - LOGO_WIDTH / 2,
          (QR_CODE_SIZE * PIXEL_RATIO) / 2 - LOGO_HEIGHT / 2,
          LOGO_WIDTH,
          LOGO_HEIGHT
        );
        // Convert the canvas to a dataUrl for dApps to use / display
        const finalImg = finalCanvas.toDataURL();
        resolve(finalImg);
      };
    });
  });