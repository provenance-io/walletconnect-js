import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WalletConnectService } from '../services';
import { CONNECTION_TIMEOUT } from '../consts';

const StateContext = createContext(undefined);
const walletConnectService = new WalletConnectService();

interface Props {
  children: ReactNode,
  network?: string,
  bridge?: string,
}

const WalletConnectContextProvider = ({ children, network, bridge }: Props) => {
  const [walletConnectState, setWalletConnectState] = useState({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    // If a network is passed in, update the default
    if (network) { walletConnectService.setNetwork(network) }
    // If a bridge is passed in, update the default
    if (bridge) {
      walletConnectService.setBridge(bridge);
    }
    // Check if we have an address and public key, if so, auto-reconnect to session
    if (walletConnectState.address) {
      // Reconnect the users walletconnect session
      walletConnectService.connect();
      // Compare the "connection initialized at" time to current time
      const now = Math.floor(Date.now() / 1000);
      const timeout = network ? CONNECTION_TIMEOUT[network] : CONNECTION_TIMEOUT.mainnet;
      if (walletConnectState.connectionIat && (now - walletConnectState.connectionIat) > timeout) {
        walletConnectService.disconnect();
      }
    }
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
    throw new Error('useWalletConnect must be used within a WalletConnectContextProvider');
  }
  return context;
};

export { WalletConnectContextProvider, useWalletConnect };
