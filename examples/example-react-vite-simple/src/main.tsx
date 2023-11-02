import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Router>
      <WalletConnectContextProvider>
        <App />
      </WalletConnectContextProvider>
    </Router>
  </StrictMode>
);
