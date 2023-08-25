import {
  CONNECTION_TYPES,
  WALLET_APP_EVENTS,
  WINDOW_MESSAGES,
} from '../../../../../consts';
import {
  BroadcastEventData,
  BroadcastEventName,
  ConnectData,
  WCSSetState,
  WCSState,
} from '../../../../../types';
import { sendWalletEvent, walletConnectAccountInfo } from '../../../../../utils';

// ------------------------
// UPDATE SESSION EVENT
// ------------------------
// - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
// - Broadcast "session_update" event (let the dApp know)
// - Start the "connection timer" to auto-disconnect wcjs when session is expired
// - Trigger wallet event for "session_update" (let the wallet know)

interface SessionUpdateEventParams {
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

export const sessionUpdateEvent = ({
  payload,
  connectionTimeout,
  setState,
  broadcast,
  startConnectionTimer,
  getState,
}: SessionUpdateEventParams) => {
  const data = payload.params[0];
  const { accounts, peerMeta: peer } = data;
  if (!accounts) {
    //if no accounts, likely a post disconnect update - bail
    return;
  }
  // Update connection expiration times
  const connectionEST = Date.now();
  const connectionEXP = connectionTimeout + connectionEST;
  // Pull out all known information about the current account
  const {
    address,
    attributes,
    jwt: signedJWT,
    publicKey,
    representedGroupPolicy,
    walletInfo,
  } = walletConnectAccountInfo(accounts);
  // Save pulled information into wcjs state
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
  // Let all listening dApps know that we've updated our session
  broadcast(WINDOW_MESSAGES.SESSION_UPDATED, {
    result: {
      connectionEST,
      connectionEXP,
      connectionType: CONNECTION_TYPES.existing_session,
    },
  });
  // Start a new connection expiration timer
  startConnectionTimer();
  // If we know the type of currently connected wallet, send a session updated event to it
  const { walletAppId } = getState();
  if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
};
