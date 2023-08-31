import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { CONNECT_URL } from 'consts';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Theme } from 'theme';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router>
      <WalletConnectContextProvider
        connectionRedirect={
          !window.location.href.includes('dapp')
            ? `${window.location.origin}${CONNECT_URL}`
            : undefined
        }
      >
        <Theme>
          <div id="portal" />
          <App />
        </Theme>
      </WalletConnectContextProvider>
    </Router>
);
