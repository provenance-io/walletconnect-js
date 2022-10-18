import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type {
  Broadcast,
  ConnectData,
  AccountInfo,
  WCSState,
  WCSSetState,
} from '../../types';
import { WINDOW_MESSAGES } from '../../consts';
import { clearLocalStorage } from '../../utils';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';

interface ConnectProps {
  state: WCSState;
  setState: WCSSetState;
  resetState: () => void;
  broadcast: Broadcast;
  customBridge?: string;
  startConnectionTimer: () => void;
  getState: () => WCSState;
}

export const connect = async ({
  state,
  setState,
  resetState,
  broadcast,
  customBridge,
  startConnectionTimer,
  getState,
}: ConnectProps) => {
  // Either use the custom bridge passed in, or default back to stage bridge
  const bridge = customBridge || state.bridge;
  // -------------------
  // PULL ACCOUNT INFO
  // -------------------
  const getAccountInfo = (accounts: AccountInfo) => {
    if (!accounts || !Array.isArray(accounts) || !accounts.length) return {};
    const firstAccount = accounts[0];
    // Accounts can either be an array of strings or an array of objects
    // Check the first value in the array to determine to type of data
    const isString = typeof firstAccount === 'string';
    // If it's a string, return data in the form of [address, publicKey, lastConnectJWT] from accounts
    if (isString) {
      const [address, publicKey, jwt] = accounts as string[];
      // No walletInfo will be available on the old accounts array
      return { address, publicKey, jwt, walletInfo: {} };
    }
    // Data is in an object, pull keys from first item
    const { address, publicKey, jwt, walletInfo } = firstAccount;
    return { address, publicKey, jwt, walletInfo };
  };
  // ----------------
  // SESSION UPDATE
  // ----------------
  const onSessionUpdate = (newConnector: WalletConnectClient) => {
    // Get connection issued time
    const connectionEST = Date.now();
    const connectionEXP = state.connectionEXP;
    // If the session is already expired (re-opened closed/idle tab), kill the session
    if (!connectionEXP || connectionEST >= connectionEXP) newConnector.killSession();
    else {
      const { accounts, peerMeta: peer } = newConnector;
      const {
        address,
        publicKey,
        jwt: lastConnectJWT,
        walletInfo,
      } = getAccountInfo(accounts);
      const signedJWT = state.signedJWT || lastConnectJWT;
      setState({
        address,
        bridge,
        publicKey,
        connected: true,
        signedJWT,
        peer,
        connectionEST,
        walletInfo,
      });
      const broadcastData = {
        data: newConnector,
        connectionEST,
        connectionEXP: state.connectionEXP,
        connectionType: 'existing session',
      };
      broadcast(WINDOW_MESSAGES.CONNECTED, broadcastData);
      // Start the auto-logoff timer
      startConnectionTimer();
    }
  };
  // ----------------
  // CONNECTED
  // ----------------
  const onConnect = (payload: ConnectData) => {
    const data = payload.params[0];
    const { accounts, peerMeta: peer } = data;
    const {
      address,
      publicKey,
      jwt: signedJWT,
      walletInfo,
    } = getAccountInfo(accounts);
    // Get connection issued/expires times (auto-logout)
    const connectionEST = Date.now();
    const connectionEXP = state.connectionTimeout + connectionEST;
    setState({
      address,
      bridge,
      publicKey,
      peer,
      connected: true,
      connectionEST,
      signedJWT,
      connectionEXP,
      walletInfo,
    });
    const broadcastData = {
      data: payload,
      connectionEST,
      connectionEXP,
    };
    broadcast(WINDOW_MESSAGES.CONNECTED, broadcastData);
    // Start the auto-logoff timer
    startConnectionTimer();
  };
  // --------------------
  // WALLET DISCONNECT
  // --------------------
  const onDisconnect = () => {
    // Get the latest state values
    const latestState = getState();
    // Check for a known wallet app with special callback functions
    const knownWalletApp = WALLET_LIST.find(
      (wallet) => wallet.id === latestState.walletApp
    );
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.DISCONNECT };
      knownWalletApp.eventAction(eventData);
    }
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT);
    // Manually clear out all of walletconnect-js from localStorage
    clearLocalStorage('walletconnect-js');
  };
  // --------------------------
  // SUBSCRIBE TO WC EVENTS
  // --------------------------
  const subscribeToEvents = (newConnector: WalletConnectClient) => {
    if (!newConnector) return;
    /* Pulled RESERVED_EVENTS from wallet connect:
      "session_request",
      "session_update", [used]
      "exchange_key",
      "connect", [used]
      "disconnect", [used]
      "display_uri",
      "modal_closed",
      "transport_open",
      "transport_close",
      "transport_error",
    */
    // Session Update
    newConnector.on('session_update', (error) => {
      if (error) throw error;
      onSessionUpdate(newConnector);
    });
    // Connect
    newConnector.on('connect', (error, payload) => {
      if (error) throw error;
      onConnect(payload);
    });
    // Disconnect
    newConnector.on('disconnect', (error) => {
      if (error) throw error;
      onDisconnect();
    });
    // Latest values
    const { accounts, peerMeta: peer } = newConnector;
    const {
      address,
      publicKey,
      jwt: lastConnectJWT,
      walletInfo,
    } = getAccountInfo(accounts);
    const signedJWT = state.signedJWT || lastConnectJWT;
    // Are we already connected
    if (newConnector.connected) {
      onSessionUpdate(newConnector);
    }
    // Update Connector
    setState({
      address,
      bridge,
      connected: !!address,
      connector: newConnector,
      peer,
      publicKey,
      signedJWT,
      walletInfo,
    });
  };
  // ----------------------------
  // CREATE NEW WC CONNECTION
  // ----------------------------
  // Create custom QRCode modal
  class QRCodeModal {
    open = async (data: string) => {
      const qrcode = await QRCode.toDataURL(data);
      setState({ QRCode: qrcode, QRCodeUrl: data, showQRCodeModal: true });
    };

    close = () => {
      setState({ showQRCodeModal: false });
    };
  }
  const qrcodeModal = new QRCodeModal();
  // create new connector
  const newConnector = new WalletConnectClient({ bridge, qrcodeModal });
  // check if already connected
  if (!newConnector.connected) {
    // create new session
    await newConnector.createSession();
  }
  // ----------------------------------------------
  // RUN SUBSCRIPTION WITH NEW WC CONNECTION
  // ----------------------------------------------
  subscribeToEvents(newConnector);
};
