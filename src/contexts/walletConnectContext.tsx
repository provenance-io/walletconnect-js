import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletConnectService } from '../services';
import type { WCSState } from '../types';

interface ProviderState {
  walletConnectService: WalletConnectService;
  walletConnectState: WCSState;
}

const StateContext = createContext<ProviderState | undefined>(undefined);
const walletConnectService = new WalletConnectService();

interface Props {
  children: React.ReactNode;
  timeout?: number;
}

const WalletConnectContextProvider: React.FC<Props> = ({ children, timeout }) => {
  const [walletConnectState, setWalletConnectState] = useState<WCSState>({
    ...walletConnectService.state,
  });
  const { address } = walletConnectState;

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    // If custom props are passed in, update the defaults
    if (timeout) {
      walletConnectService.setState({ connectionTimeout: timeout });
    }
    // Check if we have an address and public key, if so, auto-reconnect to session
    if (address) walletConnectService.connect();
    return () => walletConnectService.removeAllListeners();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StateContext.Provider value={{ walletConnectService, walletConnectState }}>
      {children}
    </StateContext.Provider>
  );
};

const useWalletConnect = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useWalletConnect must be used within a WalletConnectContextProvider'
    );
  }
  return context;
};

export { WalletConnectContextProvider, useWalletConnect };
