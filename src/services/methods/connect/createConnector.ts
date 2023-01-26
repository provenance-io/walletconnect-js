import WalletConnectClient from '@walletconnect/client';
import QRCode from 'qrcode';
import type { Broadcast, WCSSetState, WCSState, ConnectData } from '../../../types';
import {
  CONNECTION_TYPES,
  CONNECTOR_EVENTS,
  WALLET_APP_EVENTS,
  WINDOW_MESSAGES,
} from '../../../consts';
import { getAccountInfo, sendWalletEvent } from '../../../utils';

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
    const connectionEST = Date.now();
    const connectionEXP = state.connectionEXP;
    const connected = newConnector.connected;
    // If we're already connected but the session is expired, kill it
    if (connected && (!connectionEXP || connectionEST >= connectionEXP))
      newConnector.killSession();
    else {
      setState({
        connector: newConnector,
      });
      broadcast(WINDOW_MESSAGES.CONNECTED, {
        data: {
          connectionEST,
          connectionEXP: connectionEXP || 0,
          connectionType: CONNECTION_TYPES.existing_session,
        },
      });
      startConnectionTimer();
      const { walletAppId } = getState();
      if (walletAppId)
        sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
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
      connected: true, // Manually set to true since the connected event was triggered.
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
  // Disconnect Goals:
  // - Reset the walletConnectService state to default values
  // - Broadcast "disconnect" event (let the dApp know)
  // - Trigger wallet event for "disconnect" (let the wallet know)
  newConnector.on(CONNECTOR_EVENTS.disconnect, (error) => {
    if (error) throw error;
    const { walletAppId } = getState();
    if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.DISCONNECT);
    resetState();
    broadcast(WINDOW_MESSAGES.DISCONNECT);
  });
  return newConnector;
};
