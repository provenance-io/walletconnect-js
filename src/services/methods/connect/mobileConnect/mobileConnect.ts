import WalletConnectClient from '@walletconnect/client';
import { CONNECTOR_EVENTS } from '../../../../consts';
import {
  ConnectData,
  WalletConnectEventDisconnect,
  WalletConnectInitMethod,
} from '../../../../types';
import { openDirectWallet } from '../../../../utils';
import { QRCodeModal } from './QrCodeModal';
import { createQRImage } from './createQRImage';
import {
  connectEvent,
  disconnectEvent,
  sessionResumeEvent,
  sessionUpdateEvent,
} from './events';

export const mobileConnect = async ({
  // Optional values passed in
  individualAddress,
  groupAddress,
  bridge: newBridge,
  duration,
  jwtExpiration,
  prohibitGroups,
  // Service values
  state,
  setState,
  startConnectionTimer,
  getState,
  broadcastEvent,
  resetState,
  walletAppId,
  updateModal,
}: WalletConnectInitMethod): Promise<undefined | WalletConnectClient> =>
  new Promise((resolve, reject) => {
    // Shorthand walletConnectService state values used
    const { status, connectionTimeout, bridge: existingBridge } = state;
    // Only create a new connector when we're not already connected
    if (status !== 'connected') {
      // New connector we will be resolving this promise with
      let newConnector: undefined | WalletConnectClient = undefined;
      // Send the URI data directly to a specific wallet (instead of opening the qrCodeModal popup)
      // Create a new QRCodeModal class instance for the WalletConnectClient with requested connection params
      const WcQrcodeModal = new QRCodeModal({
        duration,
        jwtExpiration,
        prohibitGroups,
        requiredGroupAddress: groupAddress,
        requiredIndividualAddress: individualAddress,
        onOpenCallback: async (dataUrl: string) => {
          const qrCodeImage = await createQRImage(dataUrl);
          updateModal({
            QRCodeImg: qrCodeImage,
            QRCodeUrl: dataUrl,
            showModal: !walletAppId, // Don't trigger a QRCodeModal popup if they say "noPopup" or pass a specific walletId
            walletAppId,
          });
          // If we need to open a wallet directly, we won't be opening the QRCodeModal and will instead trigger that wallet directly
          if (walletAppId) openDirectWallet(walletAppId, dataUrl, updateModal);
        },
        onCloseCallback: () => {
          updateModal({ showModal: false });
        },
      });
      // Create new connector
      newConnector = new WalletConnectClient({
        bridge: newBridge || existingBridge,
        qrcodeModal: WcQrcodeModal,
      });
      // Calculate duration to use (use passed in or default durations)
      const finalDurationMS = duration ? duration * 1000 : connectionTimeout;
      // Convert back to seconds for wallets to use since jwtExpiration is already in seconds
      const finalDurationS = finalDurationMS / 1000;
      // Update the duration of this connection
      setState({
        connectionTimeout: finalDurationMS,
        status: 'pending',
      });
      // Create all of the newConnector events
      newConnector.on(CONNECTOR_EVENTS.connect, (error, payload: ConnectData) => {
        if (error) throw error;
        connectEvent({
          payload,
          broadcast: broadcastEvent,
          connectionTimeout,
          getState,
          setState,
          startConnectionTimer,
        });
      });
      newConnector.on(
        CONNECTOR_EVENTS.disconnect,
        (error, payload: WalletConnectEventDisconnect) => {
          if (error) throw error;
          disconnectEvent({
            payload,
            broadcast: broadcastEvent,
            getState,
            resetState,
          });
        }
      );
      newConnector.on(
        CONNECTOR_EVENTS.wc_sessionUpdate,
        (error, payload: ConnectData) => {
          if (error) throw error;
          sessionUpdateEvent({
            payload,
            connectionTimeout,
            broadcast: broadcastEvent,
            getState,
            setState,
            startConnectionTimer,
          });
        }
      );
      // The session had already previously existed, trigger the existing connection event
      if (newConnector.connected)
        sessionResumeEvent({
          broadcast: broadcastEvent,
          connectionTimeout,
          getState,
          setState,
          startConnectionTimer,
        });

      // If we're not connected, initiate a connection to this newConnector and dApp
      if (newConnector && !newConnector.connected) {
        newConnector.createSession();
      }
      // Note: set timeouts will still get ran after a resolve, it's just that a reject won't have any effect
      // If this takes more than 3s just fail it
      setTimeout(() => {
        reject(null);
      }, 3000);
      resolve(newConnector);
    }
    reject('Already Connected');
  });
