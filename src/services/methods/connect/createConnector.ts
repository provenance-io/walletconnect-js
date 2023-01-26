import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type {
  Broadcast,
  ConnectorEventData,
  WCSSetState,
  WCSState,
  WalletEventValue,
} from '../../../types';
import {
  CONNECTION_TYPES,
  CONNECTOR_EVENTS,
  WALLET_APP_EVENTS,
  WALLET_LIST,
  WINDOW_MESSAGES,
} from '../../../consts';
import { getAccountInfo } from '../../../utils';
import { sessionUpdateEvent } from './sessionUpdateEvent';

interface Props {
  bridge: string;
  broadcast: Broadcast;
  getState: () => WCSState;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  requiredAddress?: string;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}

export const createConnector = ({
  bridge,
  broadcast,
  getState,
  noPopup,
  prohibitGroups,
  requiredAddress,
  resetState,
  setState,
  state,
  startConnectionTimer,
}: Props) => {
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
  // Create new connector
  const newConnector = new WalletConnectClient({ bridge, qrcodeModal });
  const walletAppEvent = (event: WalletEventValue) => {
    const { walletAppId } = getState();
    if (walletAppId) {
      // Check for a known wallet app with special callback functions
      const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);
      // If the wallet app has an eventAction (web/extension) trigger it
      if (knownWalletApp && knownWalletApp.eventAction) {
        const eventData = { event };
        knownWalletApp.eventAction(eventData);
      }
    }
  };
  // Create all the connector events we want to listen for (connect, disconnect, session_update)
  // Handle all connector.on events as they trigger (update state and broadcast results)
  const handleEvent = (eventData: ConnectorEventData) => {
    const { stateData, broadcastData } = eventData;
    if (stateData) {
      if (stateData === 'reset') resetState();
      else setState(stateData);
    }
    if (broadcastData) {
      broadcast(broadcastData.eventName, broadcastData.payload);
    }
  };
  // ------------------------
  // SESSION_UPDATE EVENT
  // ------------------------
  // Session Update Goals:
  // - Check existing connection EXP vs now to see if session expired
  //    - Note: connectionEXP must exist to "update" the session
  // - Save accounts (account data) and peer to walletConnectService
  // - Broadcast "session_update" event (let the dApp know)
  // - Trigger wallet event for "session_update" (let the wallet know)
  newConnector.on(CONNECTOR_EVENTS.session_update, (error) => {
    if (error) throw error;
    // Check for a current signedJWT
    const existingSignedJWT = state.signedJWT;
    const connectionEST = Date.now();
    const connectionEXP = state.connectionEXP;
    const connected = newConnector.connected;
    // If we're already connected but the session is expired, kill it
    if (connected && (!connectionEXP || connectionEST >= connectionEXP))
      newConnector.killSession();
    else {
      const eventData = sessionUpdateEvent({
        connector: newConnector,
        signedJWT: existingSignedJWT,
        connectionEST,
        connectionEXP: connectionEXP || 0,
      });
      // If we're connected we want to use the broadcast from session_update, if not, then just update the state
      handleEvent(connected ? eventData : { stateData: eventData.stateData });
      startConnectionTimer();
    }
  });
  // ------------------------
  // CONNECT EVENT
  // ------------------------
  // Connect Goals:
  // - Calculate connection EST/EXP
  // - Save accounts (account data), peer, and connection EST/EXP to walletConnectService
  // - Broadcast "connect" event (let the dApp know)
  // - Trigger wallet event for "connect" (let the wallet know)
  newConnector.on(CONNECTOR_EVENTS.connect, (error, payload) => {
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
    walletAppEvent(WALLET_APP_EVENTS.CONNECT);
  });
  // ------------------------
  // DISCONNECT EVENT
  // ------------------------
  // Disconnect Goals:
  // - Reset the walletConnectService state to default values
  // - Broadcast "disconnect" event (let the dApp know)
  // - Trigger wallet event for "disconnect" (let the wallet know)
  newConnector.on(CONNECTOR_EVENTS.disconnect, (error) => {
    if (error) throw error;
    walletAppEvent(WALLET_APP_EVENTS.DISCONNECT);
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT);
  });
  return newConnector;
};
