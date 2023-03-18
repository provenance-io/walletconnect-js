import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type {
  Broadcast,
  WCSSetState,
  WCSState,
  ConnectData,
  ModalData,
} from '../../../types';
import {
  CONNECTION_TYPES,
  CONNECTOR_EVENTS,
  WALLET_APP_EVENTS,
  WINDOW_MESSAGES,
} from '../../../consts';
import { getAccountInfo, sendWalletEvent } from '../../../utils';

export interface ConnectOptions {
  bridge: string;
  broadcast: Broadcast;
  getState: () => WCSState;
  jwtExpiration?: number;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  requiredIndividualAddress?: string;
  requiredGroupAddress?: string;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
  updateModal: (newModalData: Partial<ModalData>) => void;
  onQRCodeSet?: (qrCode: { img: string; url: string }) => void;
}

export const createConnector = ({
  bridge,
  broadcast,
  getState,
  jwtExpiration,
  noPopup,
  prohibitGroups,
  requiredIndividualAddress,
  requiredGroupAddress,
  resetState,
  setState,
  startConnectionTimer,
  state,
  updateModal,
  onQRCodeSet,
}: ConnectOptions) => {
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
      const fullData = `${data}${requiredIndividualAddressParam}${requiredGroupAddressParam}${prohibitGroupsParam}${jwtExpirationParam}`;
      const qrcode = await QRCode.toDataURL(fullData);
      updateModal({ QRCodeImg: qrcode, QRCodeUrl: fullData, showModal: !noPopup });
      onQRCodeSet?.({ img: qrcode, url: fullData });
    };

    close = () => {
      updateModal({ showModal: false });
    };
  }
  const qrcodeModal = new QRCodeModal();
  // Create new connector
  const newConnector = new WalletConnectClient({ bridge, qrcodeModal });

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
      data: {
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
  newConnector.on(CONNECTOR_EVENTS.disconnect, (error) => {
    if (error) throw error;
    const { walletAppId } = getState();
    if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.DISCONNECT);
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT);
  });

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
        data: {
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
        data: {
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

  return newConnector;
};
