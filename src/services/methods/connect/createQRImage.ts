import QRCode from 'qrcode';
import { QrOptions } from '../../../types';

const defaultQrOptions: QrOptions = {
  backgroundColor: '#ffffff',
  foregroundColor: '#000000',
  logoColor: '#000000',
  padding: 0,
  showLogo: true,
};

export const createQRImage = (
  text: string,
  options: QrOptions = defaultQrOptions
): Promise<string> => {
  const backgroundColor =
    options.backgroundColor || defaultQrOptions.backgroundColor;
  const foregroundColor =
    options.foregroundColor || defaultQrOptions.foregroundColor;
  const logoColor = options.logoColor || defaultQrOptions.logoColor;
  const margin = options.padding || defaultQrOptions.padding;
  const showLogo =
    typeof options.showLogo === 'boolean'
      ? options.showLogo
      : defaultQrOptions.showLogo;

  return new Promise((resolve) => {
    QRCode.toString(text, {
      type: 'svg',
      margin,
      color: { light: backgroundColor, dark: foregroundColor },
    }).then((svgElementString) => {
      const figureLogoSvgString = `<symbol id="figureLogo" fill="none" viewBox="-37.5 -37.5 100 100"><path fill="${backgroundColor}" d="M0 0h25v25H0z"/><path fill="${logoColor}" fill-rule="evenodd" d="M8.28 5.5h8.44v2.8H8.28V5.5Zm0 14v-8.4h8.44v2.8H11.1v5.6H8.28Z" clip-rule="evenodd"/></symbol><use href="#figureLogo" />`;
      // Take this string and inject the Figure Logo into it
      // Add use and symbol right before closing </svg> tag
      const indexOfEndSvg = svgElementString.indexOf('</svg>');
      const logoSvgElementString =
        svgElementString.substring(0, indexOfEndSvg) +
        figureLogoSvgString +
        svgElementString.substring(indexOfEndSvg);
      const finalSvgElementString = showLogo
        ? logoSvgElementString
        : svgElementString;
      const svgBlob = new Blob([finalSvgElementString], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      resolve(svgUrl);
    });
  });
};
