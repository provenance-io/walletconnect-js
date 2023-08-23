import WalletConnectClient from '@walletconnect/client';
import { CONNECTOR_EVENTS, WALLET_APP_EVENTS } from '../../../../consts';
import {
  ConnectData,
  WalletConnectEventDisconnect,
  WalletConnectInitMethod,
} from '../../../../types';
import { openDirectWallet } from '../openDirectWallet';
import { QRCodeModal } from './QrCodeModal';
import { createQRImage } from './createQRImage';
import { connectEvent, disconnectEvent } from './events';

export const walletConnectInit = async ({
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
        connectionWalletAppId: walletAppId,
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
      resolve(newConnector);
    }
    reject('Already Connected');
  });

export const connect = ({
  bridge,
  broadcast,
  duration,
  getState,
  jwtExpiration,
  prohibitGroups,
  requiredGroupAddress,
  requiredIndividualAddress,
  resetState,
  setState,
  startConnectionTimer,
  state,
  updateModal,
  walletAppId: connectionWalletAppId,
}: Props): Promise<undefined | WalletConnectClient> =>
  new Promise((resolve, reject) => {
    const newConnector: undefined | WalletConnectClient = undefined;

    // ------------------------
    // SESSION RESUME EVENT
    // ------------------------
    // Walletconnect doesn't provide an event for .on(session_resume) or anything similar so we have to run that ourselves here
    // - Check existing connection EXP vs now to see if session expired
    //    - Note: connectionEXP must exist to "update" the session
    // - Save newConnector to walletConnectService state (data inside likely changed due to this event)
    // - Broadcast "session_update" event (let the dApp know)
    // - Start the "connection timer" to auto-disconnect wcjs when session is expired
    // - Trigger wallet event for "session_update" (let the wallet know)
    const resumeResumeEvent = () => {
      if (newConnector) {
        const connectionEST = state.connectionEST;
        const connectionEXP = state.connectionEXP;
        const connectionDateValue =
          !!connectionEST && !!connectionEXP && connectionEST < connectionEXP;
        const connected = newConnector.connected;
        const connectionValid = connectionDateValue && connected;
        // Connection already exists and is not expired
        if (connectionValid) {
          setState({
            connector: newConnector,
          });
          broadcast(WINDOW_MESSAGES.CONNECTED, {
            result: {
              connectionEST,
              connectionEXP,
              connectionType: CONNECTION_TYPES.existing_session,
            },
          });
          startConnectionTimer();
          const { walletAppId } = getState();
          if (walletAppId) {
            sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
          }
          resolve(newConnector);
        }
        // If we're already connected but the session is expired (or times are missing), kill it
        else if (connected && !connectionDateValue) {
          newConnector.killSession();
        }
      }
    };

    // ------------------------
    // UPDATE SESSION EVENT
    // ------------------------
    // - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
    // - Broadcast "session_update" event (let the dApp know)
    // - Start the "connection timer" to auto-disconnect wcjs when session is expired
    // - Trigger wallet event for "session_update" (let the wallet know)
    newConnector.on(
      CONNECTOR_EVENTS.wc_sessionUpdate,
      (error, payload: ConnectData) => {
        if (error) throw error;
        const data = payload.params[0];
        const { accounts, peerMeta: peer } = data;

        if (!accounts) {
          //if no accounts, likely a post disconnect update - bail
          return;
        }
        const connectionEST = Date.now();
        const connectionEXP = state.connectionTimeout + connectionEST;

        const {
          address,
          attributes,
          jwt: signedJWT,
          publicKey,
          representedGroupPolicy,
          walletInfo,
        } = getAccountInfo(accounts);
        setState({
          address,
          attributes,
          connectionEST,
          connectionEXP,
          status: 'connected',
          peer,
          publicKey,
          representedGroupPolicy,
          signedJWT,
          walletInfo,
        });
        broadcast(WINDOW_MESSAGES.SESSION_UPDATED, {
          result: {
            connectionEST,
            connectionEXP,
            connectionType: CONNECTION_TYPES.existing_session,
          },
        });
        startConnectionTimer();
        const { walletAppId } = getState();
        if (walletAppId)
          sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
      }
    );

    // The session had already previously existed, trigger the existing connection event
    if (newConnector.connected) resumeResumeEvent();

    // If we're not connected, initiate a connection to this newConnector and dApp
    if (newConnector && !newConnector.connected) {
      newConnector.createSession();
    }

    setTimeout(() => {
      reject(null);
    }, 3000); // If this takes more than 3s just fail it
  });
