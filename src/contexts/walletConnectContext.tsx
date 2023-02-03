import React, { createContext, useContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_NAMES } from '../consts';
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
  const { connectionTimeout, bridge, status } = walletConnectState;

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
    // If we suspect a previous existing connection run a connection check
    const handlePreviousConnectionCheck = () => {
      // ConnectionTimeout is saved in ms, the connect function takes it as seconds, so we need to convert
      const duration = connectionTimeout ? connectionTimeout / 1000 : undefined;
      walletConnectService.connect({ duration, bridge });
    };
    // Handle changes in localStorage | used when this tab isn't focused and localStorage data changes (added/removed)
    const handleLocalStorageEvent = (storageEvent: StorageEvent) => {
      const { key: storageEventKey, newValue, oldValue } = storageEvent;
      const newValueObj = JSON.parse(newValue || '{}');
      const oldValueObj = JSON.parse(oldValue || '{}');
      // Keys to look for within 'walletconnect' storage object
      const targetWCValues = [
        'accounts',
        'address',
        'bridge',
        'publicKey',
        'connected',
      ] as const;
      // Keys to look for within 'walletconnect-js' storage object
      const targetWCJSValues = [
        'connectionEXP',
        'connectionEST',
        'connectionTimeout',
        'signedJWT',
        'walletAppId',
      ] as const;
      type TargetValues = typeof targetWCValues | typeof targetWCJSValues;
      // Look for specific changed key values in the objects and return a final object with all the changes
      // NOTE FOR VIG TOMORROW: NOT ALL VALUES GETTING CAUGHT AS CHANGED - MAINLY ACCOUNT ADDRESS! FIXME:
      const findChangedValues = (targetValues: TargetValues) => {
        const changedValues = {} as Record<TargetValues[number], unknown>;
        targetValues.forEach((targetKey) => {
          // Accounts array holds an object with data, but we only want to look at the address value
          if (targetKey === 'accounts') {
            if (newValueObj.accounts?.address !== oldValueObj[targetKey]?.address) {
              changedValues.address = newValueObj[targetKey]?.address;
            }
          } else if (newValueObj[targetKey] !== oldValueObj[targetKey]) {
            changedValues[targetKey] = newValueObj[targetKey];
          }
        });
        return changedValues;
      };
      // Make sure the key is changing a value we care about, must be walletconnect or walletconnect-js
      if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECT) {
        const changedValues = findChangedValues(targetWCValues);
        console.log(
          'walletConnectContext.tsx | useEffect | handleLocalStorageEvent | walletconnect changedValues: ',
          changedValues,
          'newValueObj: ',
          newValueObj,
          'oldValueObj: ',
          oldValueObj
        );
      }
      if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECTJS) {
        const changedValues = findChangedValues(targetWCJSValues);
        console.log(
          'walletConnectContext.tsx | useEffect | handleLocalStorageEvent | walletconnectjs changedValues: ',
          changedValues,
          'newValueObj: ',
          newValueObj,
          'oldValueObj: ',
          oldValueObj
        );
      }
    };

    if (initialLoad) {
      setInitialLoad(false);
      // Create event listener for localStorage changes
      console.log(
        'walletConnectContext.tsx | useEffect | Add storage event listener'
      );
      window.addEventListener('storage', handleLocalStorageEvent);
      // Whenever we change the react state, update the class state
      walletConnectService.setStateUpdater(setWalletConnectState);
      // Connection might already exist, attempt to resume session
      if (status === 'pending') {
        handlePreviousConnectionCheck();
      }
    }
  }, [initialLoad, bridge, connectionTimeout, walletConnectService, status]);

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
