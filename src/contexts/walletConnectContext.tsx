import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletConnectService } from '../services';
import type { WCSState } from '../types';

interface ProviderState {
  walletConnectService: WalletConnectService;
  walletConnectState: WCSState;
}

const StateContext = createContext<ProviderState | undefined>(undefined);
const newService = new WalletConnectService();

interface Props {
  children: React.ReactNode;
  service?: WalletConnectService;
  connectionRedirect?: string;
}

const WalletConnectContextProvider: React.FC<Props> = ({
  children,
  service: existingService,
  connectionRedirect,
}) => {
  // Allow users to pass in an instance of the service themselves
  const walletConnectService = existingService || newService;
  const [walletConnectState, setWalletConnectState] = useState<WCSState>({
    ...walletConnectService.state,
  });
  const [initialLoad, setInitialLoad] = useState(true);
  const { connectionTimeout, bridge, connectionPending, connector } =
    walletConnectState;

  // If the dApp passed in a connectionRedirect then monitor "connector.connected" and redirect the user when disconnected
  useEffect(() => {
    if (connectionRedirect && !connector?.connected) {
      const currentUrl = window.location.href;
      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };
      const validUrl = isValidUrl(connectionRedirect);
      // Prevent any funny business by not passing in a string, also make sure we're not already where we need to be
      if (validUrl && currentUrl !== connectionRedirect)
        window.location.href = connectionRedirect;
    }
  }, [connectionRedirect, connector?.connected]);

  // This useEffect should only run once
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      // ------------------------------------------------------------------
      // Whenever we change the react state, update the class state
      // ------------------------------------------------------------------
      walletConnectService.setStateUpdater(setWalletConnectState);
      // ------------------------------------------------------------------
      // Connection already exists, resume session
      // ------------------------------------------------------------------
      if (connectionPending && connector?.connected) {
        // ConnectionTimeout is saved in ms, the connect function takes it as seconds, so we need to convert
        const duration = connectionTimeout ? connectionTimeout / 1000 : undefined;
        walletConnectService.connect({ duration, bridge });
      } else if (connectionPending && !connector?.connected) {
        // Normal walletConnectService startup, just set connectionPending to false, it isn't resuming a connection
        walletConnectService.setState({ connectionPending: false });
      }
    }
  }, [
    initialLoad,
    bridge,
    connectionTimeout,
    walletConnectService,
    connectionPending,
    connector?.connected,
  ]);

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
