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
  const { address, QRCodeUrl } = walletConnectState;

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    // Check if we have an address and public key, if so, auto-reconnect to session
    if (address) walletConnectService.connect();
    // Only run this check if we arn't already connected
    else {
      // Check to see if resuming connection on a new domain (url params)
      const url = new URL(window.location.href);
      // Check for referral whos value will be the wallet type to reconnect into
      const referralWalletType = url.searchParams.get('wcjs_referral');
      const matchingWallet = WALLET_LIST.find(({ id }) => id === referralWalletType);
      console.log('referralWalletType :', referralWalletType);
      console.log('matchingWallet :', matchingWallet);
      if (matchingWallet) {
        // Check for custom bridge param
        const customBridge = url.searchParams.get('wcjs_bridge');
        // Clear out search params to keep url pretty
        url.searchParams.delete('wcjs_referral');
        url.searchParams.delete('wcjs_bridge');
        const finalUrl = url.toString();
        window.history.replaceState(null, '', finalUrl);
        const asyncConnectionEvent = async () => {
          // Need an eventAction to send the reconnect event
          if (matchingWallet.eventAction) {
            // Initialize a connection
            await walletConnectService.connect({
              bridge: customBridge || '',
              noPopup: true,
            });
            // Attempt to get previous page
            const referralUrl = document.referrer;
            // Set the wallet.id passed in
            walletConnectService.setState({ walletApp: matchingWallet.id });
            // Build eventData to send to the extension
            const encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
            const eventData: EventData = {
              uri: encodedQRCodeUrl,
              event: 'walletconnect_init',
              referral: referralUrl,
            };
            // FIX: Not getting URI in event data
            console.log('eventData :', eventData);
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
