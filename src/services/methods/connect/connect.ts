import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type {
  WCSSetState,
  WCSState,
  ConnectData,
  ModalData,
  WalletId,
  EventData,
  WalletConnectEventDisconnect,
  BroadcastEventName,
  BroadcastEventData,
} from '../../../types';
import {
  CONNECTION_TYPES,
  CONNECTOR_EVENTS,
  WALLET_APP_EVENTS,
  WALLET_LIST,
  WINDOW_MESSAGES,
} from '../../../consts';
import { getAccountInfo, sendWalletEvent } from '../../../utils';

interface Props {
  bridge: string;
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
  duration: number;
  getState: () => WCSState;
  jwtExpiration?: number;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  requiredGroupAddress?: string;
  requiredIndividualAddress?: string;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
  updateModal: (
    newModalData: Partial<ModalData> & { walletAppId?: WalletId }
  ) => void;
  walletAppId?: WalletId;
}

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
}: Props): Promise<{
  QRCodeImg: string;
  QRCodeUrl: string;
  showModal: boolean;
  walletAppId: string;
  connector: null | WalletConnectClient;
  success: boolean;
}> =>
  new Promise((resolve, reject) => {
    let newConnector: null | WalletConnectClient = null;
    const openDirectWallet = (targetWalletId: WalletId, uriData: string) => {
      // Find the target wallet based on id
      const targetWallet = WALLET_LIST.find(
        ({ id: walletId }) => walletId === targetWalletId
      );
      if (targetWallet) {
        const runEventAction = () => {
          // If the wallet has an eventAction (they should all have an event action...)
          if (targetWallet.eventAction) {
            // Build eventdata to send to the extension
            const eventData: EventData = {
              uri: uriData,
              event: 'walletconnect_init',
              redirectUrl: window.location.href,
            };
            // Trigger the event action based on the wallet
            targetWallet.eventAction(eventData);
          }
        };
        // Do we need to build dynamic links for this wallet (typically mobile wallets in responsive mode)
        if (targetWallet.generateUrl) {
          const dynamicUrl = targetWallet.generateUrl(uriData);
          // Save the new dynamicUrl into the modal state
          updateModal({ dynamicUrl });
        }
        // Wallet includes a self-existence check function
        if (targetWallet.walletCheck) {
          // Use function to see if wallet exists
          const walletExists = targetWallet.walletCheck();
          // Wallet exists, run the proper event action
          if (walletExists) runEventAction();
          // Wallet doesn't exist, send the user to the wallets download url (if provided)
          else if (targetWallet.walletUrl) {
            window.open(targetWallet.walletUrl);
          }
        } else {
          // No self-existence check required, just run the event action for this wallet
          runEventAction();
        }
      }
    };

    class QRCodeModal {
      open = async (data: string) => {
        // Check for address and prohibit groups values to append to the wc value for the wallet to read when connecting
        const requiredIndividualAddressParam = requiredIndividualAddress
          ? `&individualAddress=${requiredIndividualAddress}`
          : '';
        const requiredGroupAddressParam = requiredGroupAddress
          ? `&groupAddress=${requiredGroupAddress}`
          : '';
        const prohibitGroupsParam = prohibitGroups ? `&prohibitGroups=true` : '';
        const jwtExpirationParam = jwtExpiration
          ? `&jwtExpiration=${jwtExpiration}`
          : '';
        const connectionDurationParam = duration
          ? `&connectionDuration=${duration}`
          : '';
        const fullData = `${data}${requiredIndividualAddressParam}${requiredGroupAddressParam}${prohibitGroupsParam}${jwtExpirationParam}${connectionDurationParam}`;
        const qrcode = await QRCode.toDataURL(fullData);
        // Don't trigger a QRCodeModal popup if they say "noPopup" or pass a specific walletId
        updateModal({
          QRCodeImg: qrcode,
          QRCodeUrl: fullData,
          showModal: !connectionWalletAppId,
          walletAppId: connectionWalletAppId,
        });
        // If we need to open a wallet directly, we won't be opening the QRCodeModal and will instead trigger that wallet directly
        if (connectionWalletAppId) openDirectWallet(connectionWalletAppId, fullData);
        resolve({
          QRCodeImg: qrcode,
          QRCodeUrl: fullData,
          showModal: !connectionWalletAppId,
          walletAppId: connectionWalletAppId ? connectionWalletAppId : '',
          connector: newConnector,
          success: true,
        });
      };

      close = () => {
        updateModal({ showModal: false });
      };
    }
    const qrcodeModal = new QRCodeModal();
    // Create new connector
    newConnector = new WalletConnectClient({ bridge, qrcodeModal });
    // ------------------------
    // CONNECT EVENT
    // ------------------------
    // - Calculate new connection EST/EXP
    // - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
    // - Broadcast "connect" event (let the dApp know)
    // - Start the "connection timer" to auto-disconnect wcjs when session is expired
    // - Trigger wallet event for "connect" (let the wallet know)
    newConnector.on(CONNECTOR_EVENTS.connect, (error, payload: ConnectData) => {
      if (error) throw error;
      const connectionEST = Date.now();
      const connectionEXP = state.connectionTimeout + connectionEST;
      const data = payload.params[0];
      const { accounts, peerMeta: peer } = data;
      const {
        address,
        jwt: signedJWT,
        publicKey,
        representedGroupPolicy,
        walletInfo,
      } = getAccountInfo(accounts);
      setState({
        address,
        connectionEST,
        connectionEXP,
        status: 'connected',
        peer,
        publicKey,
        representedGroupPolicy,
        signedJWT,
        walletInfo,
      });
      broadcast(WINDOW_MESSAGES.CONNECTED, {
        result: {
          connectionEST,
          connectionEXP,
          connectionType: CONNECTION_TYPES.new_session,
        },
      });
      startConnectionTimer();
      const { walletAppId } = getState();
      if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.CONNECT);
    });
    // ------------------------
    // DISCONNECT EVENT
    // ------------------------
    // - Trigger wallet event for "disconnect" (let the wallet know)
    // - Reset the walletConnectService state to default values
    // - Broadcast "disconnect" event (let the dApp know)
    newConnector.on(
      CONNECTOR_EVENTS.disconnect,
      (error, payload: WalletConnectEventDisconnect) => {
        if (error) throw error;
        const { walletAppId } = getState();
        if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.DISCONNECT);
        resetState();
        broadcast(WINDOW_MESSAGES.DISCONNECT, {
          result: payload.params[0],
        });
      }
    );

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
          if (walletAppId)
            sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
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
          jwt: signedJWT,
          publicKey,
          representedGroupPolicy,
          walletInfo,
        } = getAccountInfo(accounts);
        setState({
          address,
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
      reject({
        QRCodeImg: '',
        QRCodeUrl: '',
        showModal: false,
        walletAppId: '',
        connector: null,
        success: false,
      });
    }, 3000); // If this takes more than 3s just fail it

    // return newConnector;
  });
