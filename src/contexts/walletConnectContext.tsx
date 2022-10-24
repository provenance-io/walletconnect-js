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
}
/**
 *
 * @param children Other elements/rest of app children to render
 * @param timeout How long should the initial connection to the dApp last? (seconds)
 */
const WalletConnectContextProvider: React.FC<Props> = ({ children }) => {
  const [walletConnectState, setWalletConnectState] = useState<WCSState>({
    ...walletConnectService.state,
  });
  const { address } = walletConnectState;

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
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
