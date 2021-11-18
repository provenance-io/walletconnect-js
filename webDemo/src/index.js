import ReactDOM from 'react-dom';
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'redux/store';
import { App } from 'App';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from 'theme';
// Bring in Google Fonts
import './theme/font/fontFamily.css';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <WalletConnectContextProvider network="testnet">
            <GlobalStyle />
            <App />
          </WalletConnectContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

