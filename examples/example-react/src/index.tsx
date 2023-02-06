import { createRoot } from 'react-dom/client';
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { Theme } from 'theme';
import { CONNECT_URL } from 'consts';
import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <Router>
      <WalletConnectContextProvider
        connectionRedirect={`${window.location.origin}${CONNECT_URL}`}
      >
        <Theme>
          <div id="portal" />
          <App />
        </Theme>
      </WalletConnectContextProvider>
    </Router>
  </StrictMode>
);
