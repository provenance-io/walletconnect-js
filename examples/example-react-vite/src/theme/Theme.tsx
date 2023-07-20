import { SpriteSheet } from 'Components';
import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createGlobalStyle, DefaultTheme, ThemeProvider } from 'styled-components';
import { normalize } from 'styled-normalize';
import { COLORS } from './colors';
import { BaseTypographyLoader, FONTS } from './fonts';

const baseTheme: DefaultTheme = {
  colors: { ...COLORS },
  fonts: { ...FONTS },
};

const GlobalStyles = createGlobalStyle`
  ${normalize}

  html {
    font-size: 62.5%; // 1rem = 10px
    box-sizing: border-box;
    background: ${COLORS.BACKGROUND_1};
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    color: ${COLORS.NEUTRAL_600};
    font-family: ${FONTS.PRIMARY_FONT};
    font-weight: 400;
    font-size: 1.6rem;
  }

  pre {
    white-space: break-spaces;
    line-height: 1.8rem;
    font-size: 1.2rem;
    word-break: break-word;
  }

  button, div, a, p {
    letter-spacing: 0.04rem;
    margin-bottom: 0;
    margin-top: 0;
  }

  a {
    color: ${COLORS.PRIMARY_400};
    text-decoration: none;
    &:hover{
      color: ${COLORS.PRIMARY_450};
    }
  }

  #root {
    height: 100%;
  }
`;

interface ThemeProps {
  children: ReactNode;
  theme?: object;
}

export const Theme = ({ children, theme = {} }: ThemeProps) => (
  <ThemeProvider theme={{ ...baseTheme, ...theme }}>
    <HelmetProvider>
      <SpriteSheet />
      <BaseTypographyLoader />
      <GlobalStyles />
      {children}
    </HelmetProvider>
  </ThemeProvider>
);
