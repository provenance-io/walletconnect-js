import WalletConnectClient from "@walletconnect/client";
import QRCode from 'qrcode';

import { WALLETCONNECT_BRIDGE_URL, WINDOW_MESSAGES } from '../../consts';

export const connect = async (setState, resetState, broadcast) => {
  // ----------------
  // SESSION UPDATE
  // ----------------
  const onSessionUpdate = (updatedAccounts) => {
    const [address, publicKey] = updatedAccounts;
    setState({ address, publicKey, connected: true });
    // await getAccountAssets(newAddress);
    broadcast(WINDOW_MESSAGES.CONNECTED);
  };
  // ----------------
  // CONNECTED
  // ----------------
  const onConnect = (payload) => {
    const { accounts, peerMeta: peer } = payload.params[0];
    const [address, publicKey] = accounts;
    setState({ address, publicKey, peer, connected: true });
    broadcast(WINDOW_MESSAGES.CONNECTED);
  };
  // --------------------
  // WALLET DISCONNECT
  // --------------------
  const onDisconnect = () => {
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT);
  };
  // --------------------------
  // SUBSCRIBE TO WC EVENTS
  // --------------------------
  const subscribeToEvents = (newConnector) => {
    if (!newConnector) return;
    // Session Update
    newConnector.on("session_update", (error, payload) => {
      if (error) throw error;
      const { accounts } = payload.params[0];
      onSessionUpdate(accounts);
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
      onSessionUpdate(updatedAccounts);
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
      setState({ QRCode: qrcode, showQRCodeModal: true });
    }
    
    close = () => {
      setState({ showQRCodeModal: false });
    }
  };
  const qrcodeModal = new QRCodeModal();
  // create new connector
  const newConnector = new WalletConnectClient({ bridge: WALLETCONNECT_BRIDGE_URL, qrcodeModal });
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
