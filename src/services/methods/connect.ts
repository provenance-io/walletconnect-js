import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type { Broadcast, ConnectData, WCSState, WCSSetState } from '../../types';
import { CONNECTION_TYPES, CONNECTOR_EVENTS, WINDOW_MESSAGES } from '../../consts';
import { clearLocalStorage, getAccountInfo } from '../../utils';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';

interface ConnectProps {
  address?: string;
  bridge: string;
  broadcast: Broadcast;
  getState: () => WCSState;
  prohibitGroups?: boolean;
  noPopup?: boolean;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}

export const connect = async ({
  address: requiredAddress,
  prohibitGroups,
  bridge,
  broadcast,
  getState,
  noPopup,
  resetState,
  setState,
  startConnectionTimer,
  state,
}: ConnectProps) => {
  // --------------------------------
  // HANDLE SESSION UPDATE EVENT
  // --------------------------------
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
        representedGroupPolicy,
      } = getAccountInfo(accounts);
      const signedJWT = state.signedJWT || lastConnectJWT;
      setState({
        address,
        bridge: newConnector.bridge,
        publicKey,
        connected: newConnector.connected,
        signedJWT,
        peer,
        connectionEST,
        walletInfo,
        representedGroupPolicy,
      });
      const broadcastData = {
        connector: newConnector,
        connectionEST,
        connectionEXP: state.connectionEXP || 0,
        connectionType: CONNECTION_TYPES.existing_session,
      };
      broadcast(WINDOW_MESSAGES.CONNECTED, { data: broadcastData });
      // Start the auto-logoff timer
      startConnectionTimer();
    }
  };
  // --------------------------------
  // HANDLE CONNECT EVENT
  // --------------------------------
  const onConnect = (payload: ConnectData) => {
    const data = payload.params[0];
    const { accounts, peerMeta: peer } = data;
    const {
      address,
      publicKey,
      jwt: signedJWT,
      walletInfo,
      representedGroupPolicy,
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
      representedGroupPolicy,
    });
    const broadcastData = {
      data: payload,
      connectionEST,
      connectionEXP,
      connectionType: CONNECTION_TYPES.new_session,
    };
    broadcast(WINDOW_MESSAGES.CONNECTED, broadcastData);
    // Start the auto-logoff timer
    startConnectionTimer();
  };
  // --------------------------------
  // HANDLE DISCONNECT EVENT
  // --------------------------------
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
  // -----------------------------------
  // SUBSCRIBE TO CONNECTOR EVENTS
  // -----------------------------------
  const subscribeToEvents = (newConnector: WalletConnectClient) => {
    if (!newConnector) return;
    newConnector.on(CONNECTOR_EVENTS.session_update, (error) => {
      if (error) throw error;
      onSessionUpdate(newConnector);
    });
    newConnector.on(CONNECTOR_EVENTS.connect, (error, payload) => {
      if (error) throw error;
      onConnect(payload);
    });
    newConnector.on(CONNECTOR_EVENTS.disconnect, (error) => {
      if (error) throw error;
      onDisconnect();
    });
  };
  // -------------------------------------------------------------
  // UPDATE WALLETCONNECTSERVICE WITH NEWCONNECTOR VALUES
  // -------------------------------------------------------------
  const updateWalletConnectService = (newConnector: WalletConnectClient) => {
    const { accounts, peerMeta: peer } = newConnector;
    const {
      address,
      publicKey,
      jwt: lastConnectJWT,
      walletInfo,
      representedGroupPolicy,
    } = getAccountInfo(accounts);
    const signedJWT = state.signedJWT || lastConnectJWT;
    // Are we already connected, run the session_update event
    if (newConnector.connected) {
      onSessionUpdate(newConnector);
    }
    // Update WalletConnectService State w/latest info
    setState({
      address,
      bridge: newConnector.bridge,
      connected: newConnector.connected,
      connector: newConnector,
      peer,
      publicKey,
      signedJWT,
      walletInfo,
      representedGroupPolicy,
    });
  };
  // ------------------------
  // CREATE NEW CONNECTOR
  // ------------------------
  const createNewConnector = () => {
    class QRCodeModal {
      open = async (data: string) => {
        // Check for address and prohibit groups values to append to the wc value for the wallet to read when connecting
        const requiredAddressParam = requiredAddress
          ? `&address=${requiredAddress}`
          : '';
        const prohibitGroupsParam = prohibitGroups ? `&prohibitGroups=true` : '';
        const fullData = `${data}${requiredAddressParam}${prohibitGroupsParam}`;
        const qrcode = await QRCode.toDataURL(fullData);
        setState({ QRCode: qrcode, QRCodeUrl: fullData, showQRCodeModal: !noPopup });
      };

      close = () => {
        setState({ showQRCodeModal: false });
      };
    }
    const qrcodeModal = new QRCodeModal();
    // create new connector
    const newConnector = new WalletConnectClient({ bridge, qrcodeModal });
    return newConnector;
  };

  const newConnector = createNewConnector();
  // check if this new connector is already connected to a dApp
  if (!newConnector.connected) {
    // Since it's not already connected, create a new session
    await newConnector.createSession();
  }
  subscribeToEvents(newConnector);
  updateWalletConnectService(newConnector);

  return;
};
