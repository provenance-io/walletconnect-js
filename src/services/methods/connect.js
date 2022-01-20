import WalletConnectClient from "@walletconnect/client";
import QRCode from 'qrcode';
import { WINDOW_MESSAGES } from '../../consts';
import { clearLocalStorage } from '../../utils';

export const connect = async (setState, resetState, broadcast, bridge) => {
  // Get current time (use time to auto-logout)
  const connectionIat = Math.floor(Date.now() / 1000);
  // ----------------
  // SESSION UPDATE
  // ----------------
  const onSessionUpdate = (newConnector) => {
    const { accounts, _accounts } = newConnector;
    const updatedAccounts = accounts || _accounts;
    const [address, publicKey] = updatedAccounts;
    setState({ address, publicKey, connected: true });
    broadcast(WINDOW_MESSAGES.CONNECTED, newConnector);
  };
  // ----------------
  // CONNECTED
  // ----------------
  const onConnect = (payload) => {
    const data = payload.params[0];
    const { accounts, peerMeta: peer } = data;
    const [address, publicKey] = accounts;
    setState({ address, publicKey, peer, connected: true, connectionIat });
    broadcast(WINDOW_MESSAGES.CONNECTED, data);
  };
  // --------------------
  // WALLET DISCONNECT
  // --------------------
  const onDisconnect = (payload) => {
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT, payload);
    // Manually clear out all of walletconnect-js from localStorage
    clearLocalStorage('walletconnect-js');
  };
  // --------------------------
  // SUBSCRIBE TO WC EVENTS
  // --------------------------
  const subscribeToEvents = (newConnector) => {
    if (!newConnector) return;
    // Session Update
    newConnector.on("session_update", (error) => {
      if (error) throw error;
      onSessionUpdate(newConnector);
    });
    // Connect
    newConnector.on("connect", (error, payload) => {
      if (error) throw error;
      onConnect(payload);
    });
    // Disconnect
    newConnector.on("disconnect", (error, payload) => {
      if (error) throw error;
      onDisconnect(payload);
    });
    // Latest values
    const { accounts, _accounts } = newConnector;
    const updatedAccounts = accounts || _accounts;
    const [address, publicKey] = updatedAccounts;
    // Are we already connected
    if (newConnector.connected) {
      onSessionUpdate(newConnector);
    }
    // Update Connector
    setState({ connector: newConnector, connected: !!address, address, publicKey });
  };
  // ----------------------------
  // CREATE NEW WC CONNECTION
  // ----------------------------
  // Create custom QRCode modal
  class QRCodeModal {
    open = async (data) => {
      const qrcode = await QRCode.toDataURL(data);
      setState({ QRCode: qrcode, QRCodeUrl: data, showQRCodeModal: true });
    }
    
    close = () => {
      setState({ showQRCodeModal: false });
    }
  };
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
