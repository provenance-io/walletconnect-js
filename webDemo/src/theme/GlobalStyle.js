import { createGlobalStyle } from 'styled-components';
import { reset } from './reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  html {
    font-family: ${({ theme }) => theme.FONT_FAMILY_PRIMARY };
    font-size: 62.5%; /* =10px and will allow for all rem sizing to be easier, 1.4 rem => 14px*/
    color: ${({ theme }) => theme.FONT_COLOR_PRIMARY };
  }
  html, *, ::after, ::before {
    box-sizing: border-box;
  }
  body {
    font-size: 10px;
    letter-spacing: 0.045rem;
    height: 100%;
    min-height: 100vh;
    position:relative;
    background: ${({ theme }) => theme.PAGE_BG };
    line-height: 2rem;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.FONT_FAMILY_SECONDARY };
  }
  a {
    color: ${({ theme }) => theme.LINK_COLOR };
    text-decoration: none;
  }
`;
