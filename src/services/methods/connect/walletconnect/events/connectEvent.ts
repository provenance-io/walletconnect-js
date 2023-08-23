import {
  CONNECTION_TYPES,
  WALLET_APP_EVENTS,
  WINDOW_MESSAGES,
} from '../../../../../consts';
import type {
  BroadcastEventData,
  BroadcastEventName,
  ConnectData,
  WCSSetState,
  WCSState,
} from '../../../../../types';
import { getAccountInfo, sendWalletEvent } from '../../../../../utils';

interface ConnectEventArgs {
  payload: ConnectData;
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
  setState: WCSSetState;
  getState: () => WCSState;
  startConnectionTimer: () => void;
  connectionTimeout: number;
}

// ------------------------
// CONNECT EVENT
// ------------------------
// - Calculate new connection EST/EXP
// - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
// - Broadcast "connect" event (let the dApp know)
// - Start the "connection timer" to auto-disconnect wcjs when session is expired
// - Trigger wallet event for "connect" (let the wallet know)
export const connectEvent = ({
  payload,
  broadcast,
  setState,
  startConnectionTimer,
  getState,
  connectionTimeout,
}: ConnectEventArgs) => {
  const connectionEST = Date.now();
  const connectionEXP = connectionTimeout + connectionEST;
  const data = payload.params[0];
  const { accounts, peerMeta: peer } = data;
  const {
    address,
    attributes,
    jwt: signedJWT,
    publicKey,
    representedGroupPolicy,
    walletInfo,
  } = getAccountInfo(accounts);
  setState({
    address,
    attributes,
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
};