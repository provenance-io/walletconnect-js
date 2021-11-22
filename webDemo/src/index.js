import ReactDOM from 'react-dom';
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { StrictMode } from 'react';
import { App } from './App';
// Bring in Google Fonts and base styles
import './base.css';

ReactDOM.render(
  <StrictMode>
    <WalletConnectContextProvider network="testnet">
      <App />
    </WalletConnectContextProvider>
  </StrictMode>,
  document.getElementById('root')
);

