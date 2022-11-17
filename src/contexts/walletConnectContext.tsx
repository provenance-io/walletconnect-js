import React, { createContext, useContext, useEffect, useState } from 'react';
import { WALLET_LIST } from '../consts';
import { WalletConnectService } from '../services';
import type { WCSState, EventData } from '../types';

interface ProviderState {
  walletConnectService: WalletConnectService;
  walletConnectState: WCSState;
}

const StateContext = createContext<ProviderState | undefined>(undefined);
const walletConnectService = new WalletConnectService();

interface Props {
  children: React.ReactNode;
}

const WalletConnectContextProvider: React.FC<Props> = ({ children }) => {
  const [walletConnectState, setWalletConnectState] = useState<WCSState>({
    ...walletConnectService.state,
  });
  const { address, connectionTimeout, bridge } = walletConnectState;

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    // Check if we have an address and public key, if so, auto-reconnect to session
    if (address) {
      // ConnectionTimeout is saved in ms, the connect function takes it as seconds, so we need to convert
      const duration = connectionTimeout / 1000;
      walletConnectService.connect({ duration, bridge });
    }
    // Only run this check if we arn't already connected
    else {
      // Check to see if resuming connection on a new domain (url params)
      const url = new URL(window.location.href);
      // Check for referral whos value will be the wallet type to reconnect into
      const walletId = url.searchParams.get('wcjs_wallet');
      // Check for custom bridge param
      const customBridge = url.searchParams.get('wcjs_bridge');
      // Check for custom duration param (duration is in the url as ms)
      const customDuration = url.searchParams.get('wcjs_duration');
      const matchingWallet = WALLET_LIST.find(({ id }) => id === walletId);
      if (matchingWallet) {
        const asyncConnectionEvent = async () => {
          // Clear out search params to keep url pretty
          url.searchParams.delete('wcjs_wallet');
          url.searchParams.delete('wcjs_bridge');
          url.searchParams.delete('wcjs_duration');
          const finalUrl = url.toString();
          window.history.replaceState(null, '', finalUrl);
          // Need an eventAction to send the reconnect event
          if (matchingWallet.eventAction) {
            // Initialize a connection
            await walletConnectService.connect({
              bridge: customBridge || undefined,
              noPopup: true,
              // Duration is in the url in ms.  Connect requires duration as seconds
              duration: customDuration ? Number(customDuration) / 1000 : undefined,
            });
            // Attempt to get previous page
            const referralUrl = document.referrer;
            // Set the wallet.id passed in
            walletConnectService.setState({ walletApp: matchingWallet.id });
            // Build eventData to send to the extension
            const encodedQRCodeUrl = encodeURIComponent(
              walletConnectService.state?.QRCodeUrl
            );
            const eventData: EventData = {
              uri: encodedQRCodeUrl,
              event: 'walletconnect_init',
              referral: referralUrl,
              duration: customDuration ? Number(customDuration) : undefined,
            };
            // Trigger the event action based on the wallet
            matchingWallet.eventAction(eventData);
          }
        };
        asyncConnectionEvent();
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
    throw new Error(
      'useWalletConnect must be used within a WalletConnectContextProvider'
    );
  }
  return context;
};

export { WalletConnectContextProvider, useWalletConnect };
