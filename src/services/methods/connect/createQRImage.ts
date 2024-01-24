import QRCode from 'qrcode';

export const createQRImage = (text: string): Promise<string> =>
  new Promise((resolve) => {
    QRCode.toString(text, { type: 'svg', margin: 0 }).then((svgElementString) => {
      const figureLogoSvgString =
        '<symbol id="figureLogo" fill="none" viewBox="-37.5 -37.5 100 100"><path fill="#fff" d="M0 0h25v25H0z"/><path fill="#000" fill-rule="evenodd" d="M8.28 5.5h8.44v2.8H8.28V5.5Zm0 14v-8.4h8.44v2.8H11.1v5.6H8.28Z" clip-rule="evenodd"/></symbol><use href="#figureLogo" />';
      // Take this string and inject the Figure Logo into it
      // Add use and symbol right before closing </svg> tag
      const indexOfEndSvg = svgElementString.indexOf('</svg>');
      const finalSvgElementString =
        svgElementString.substring(0, indexOfEndSvg) +
        figureLogoSvgString +
        svgElementString.substring(indexOfEndSvg);
      const svgBlob = new Blob([finalSvgElementString], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      resolve(svgUrl);
    });
  });
