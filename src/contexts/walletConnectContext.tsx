import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHostedWalletIframe } from '../hooks/useHostedWalletIframe';
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
  useHostedWalletIframe();
  const { status } = walletConnectState;

  // Auto-redirect was passed in.  Act on disconnected status
  useEffect(() => {
    if (connectionRedirect && status === 'disconnected') {
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
  }, [connectionRedirect, status]);

  // This useEffect should only run once
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      // Create event listener for localStorage changes
      window.addEventListener(
        'storage',
        walletConnectService.handleLocalStorageChange
      );
      // Whenever we change the react state, update the class state
      walletConnectService.setContextUpdater(setWalletConnectState);
    }
  }, [initialLoad, walletConnectService]);

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
