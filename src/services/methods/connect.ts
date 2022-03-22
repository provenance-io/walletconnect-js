import WalletConnectClient from "@walletconnect/client";
import QRCode from 'qrcode';
import { Broadcast, ConnectData } from 'types';
import { WINDOW_MESSAGES } from '../../consts';
import { clearLocalStorage } from '../../utils';
import { SetState, State } from '../walletConnectService';

interface ConnectProps {
  state: State,
  setState: SetState,
  resetState: () => void,
  broadcast: Broadcast,
  bridge: string,
  startConnectionTimer: () => void,
}

export const connect = async ({
                                state,
                                setState,
                                resetState,
                                broadcast,
                                bridge,
                                startConnectionTimer,
                              }: ConnectProps) => {

  const parseAccounts = (accounts:string[]) => {
    let retObj = Object();
    if(accounts.length == 1) {
      //new style accounts
      retObj = accounts[0];
    } else if (accounts.length > 1) {
      //old style accounts
      const [ address, publicKey, jwt ] = accounts;
      retObj = { address, publicKey, jwt };
    }
    return retObj;
  };

  // ----------------
  // SESSION UPDATE
  // ----------------
  const onSessionUpdate = (newConnector: WalletConnectClient) => {
    // Get connection issued time
    const connectionIat = Math.floor(Date.now() / 1000);
    const connectionEat = state.connectionEat;
    // If the session is already expired (re-opened closed/idle tab), kill the session
    if (!connectionEat || connectionIat >= connectionEat) newConnector.killSession();
    else {
      const { accounts, peerMeta: peer } = newConnector;
      const { address, publicKey, jwt } = parseAccounts(accounts);
      const signedJWT = state.signedJWT || jwt;
      setState({ address, publicKey, connected: true, signedJWT, peer, connectionIat });
      const broadcastData = {
        data: newConnector,
        connectionIat,
        connectionEat: state.connectionEat,
        connectionType: 'existing session'
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
    const { address, publicKey, jwt } = parseAccounts(accounts);

    // Get connection issued/expires times (auto-logout)
    const connectionIat = Math.floor(Date.now() / 1000);
    const connectionEat = state.connectionTimeout + connectionIat;
    setState({ address, publicKey, peer, connected: true, connectionIat, signedJWT: jwt, connectionEat });
    const broadcastData = {
      data: payload,
      connectionIat,
      connectionEat,
      connectionType: 'new session'
    };
    broadcast(WINDOW_MESSAGES.CONNECTED, broadcastData);
    // Start the auto-logoff timer
    startConnectionTimer();
  };
  // --------------------
  // WALLET DISCONNECT
  // --------------------
  const onDisconnect = () => {
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
    newConnector.on("disconnect", (error) => {
      if (error) throw error;
      onDisconnect();
    });
    // Latest values
    const { accounts, peerMeta: peer } = newConnector;
    const { address, publicKey, jwt } = parseAccounts(accounts);
    const signedJWT = state.signedJWT || jwt;
    // Are we already connected
    if (newConnector.connected) {
      onSessionUpdate(newConnector);
    }
    // Update Connector
    setState({ connector: newConnector, connected: !!address, address, publicKey, signedJWT: jwt, peer });
  }
  // ----------------------------
  // CREATE NEW WC CONNECTION
  // ----------------------------
  // Create custom QRCode modal
  class QRCodeModal {
    open = async (data: string) => {
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
