import { createRoot } from 'react-dom/client';
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { StrictMode } from 'react';
import { App } from './App';
// Bring in Google Fonts and base styles
import './base.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <WalletConnectContextProvider>
      <div id="portal" />
      <App />
    </WalletConnectContextProvider>
  </StrictMode>
);
