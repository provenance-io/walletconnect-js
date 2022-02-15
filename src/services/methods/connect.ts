import WalletConnectClient from "@walletconnect/client";
import QRCode from 'qrcode';
import { Broadcast } from 'types';
import { WINDOW_MESSAGES } from '../../consts';
import { clearLocalStorage } from '../../utils';
import { SetState } from '../walletConnectService';

export const connect = async (setState: SetState, resetState: () => void, broadcast: Broadcast, bridge: string) => {
  // Get current time (use time to auto-logout)
  const connectionIat = Math.floor(Date.now() / 1000);
  // ----------------
  // SESSION UPDATE
  // ----------------
  const onSessionUpdate = (newConnector: WalletConnectClient) => {
    const { accounts, peerMeta: peer } = newConnector;
    const [address, publicKey, signedJWT] = accounts;
    setState({ address, publicKey, connected: true, signedJWT, peer });
    broadcast(WINDOW_MESSAGES.CONNECTED, newConnector);
  };
  // ----------------
  // CONNECTED
  // ----------------
  const onConnect = (payload) => {
    const data = payload.params[0];
    const { accounts, peerMeta: peer } = data;
    const [address, publicKey, signedJWT] = accounts;
    setState({ address, publicKey, peer, connected: true, connectionIat, signedJWT });
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
    const { accounts, _accounts, peerMeta: peer, _peerMeta: _peer } = newConnector;
    const updatedAccounts = accounts || _accounts;
    const updatedPeer = peer || _peer;
    const [address, publicKey, signedJWT] = updatedAccounts;
    // Are we already connected
    if (newConnector.connected) {
      onSessionUpdate(newConnector);
    }
    // Update Connector
    setState({ connector: newConnector, connected: !!address, address, publicKey, signedJWT, peer: updatedPeer });
  }
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
