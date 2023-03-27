import { Helmet } from 'react-helmet-async';

export const FONTS = {
  PRIMARY_FONT: '"Gothic A1", sans-serif',
  SECONDARY_FONT: '"Poppins", sans-serif',
  MONOSPACE_FONT: '"Courier New", Courier, monospace',
};

export const BaseTypographyLoader = () => (
  <Helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;500;700&family=Poppins:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </Helmet>
);
