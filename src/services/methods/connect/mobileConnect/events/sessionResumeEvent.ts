import {
  CONNECTION_TYPES,
  WALLET_APP_EVENTS,
  WINDOW_MESSAGES,
} from '../../../../../consts';
import {
  BroadcastEventData,
  BroadcastEventName,
  WCSSetState,
  WCSState,
} from '../../../../../types';
import { sendWalletEvent } from '../../../../../utils';
// ------------------------
// SESSION RESUME EVENT
// ------------------------
// Walletconnect doesn't provide an event for .on(session_resume) or anything similar so we have to run that ourselves here
// - Check existing connection EXP vs now to see if session expired
//    - Note: connectionEXP must exist to "update" the session
// - Save newConnector to walletConnectService state (data inside likely changed due to this event)
// - Broadcast "session_update" event (let the dApp know)
// - Start the "connection timer" to auto-disconnect wcjs when session is expired
// - Trigger wallet event for "session_update" (let the wallet know)

interface SessionResumeEventParams {
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
  setState: WCSSetState;
  getState: () => WCSState;
  startConnectionTimer: () => void;
  connectionTimeout: number;
}

export const sessionResumeEvent = ({
  connector,
  connectionEST,
  connectionEXP,
  setState,
  startConnectionTimer,
  getState,
  broadcast,
}: SessionResumeEventParams) => {
  if (connector) {
    const connectionDateValue =
      !!connectionEST && !!connectionEXP && connectionEST < connectionEXP;
    const connected = connector.connected;
    const connectionValid = connectionDateValue && connected;
    // Connection already exists and is not expired
    if (connectionValid) {
      setState({
        connector,
      });
      broadcast(WINDOW_MESSAGES.CONNECTED, {
        result: {
          connectionEST,
          connectionEXP,
          connectionType: CONNECTION_TYPES.existing_session,
        },
      });
      startConnectionTimer();
      const { walletAppId } = getState();
      if (walletAppId) {
        sendWalletEvent(walletAppId, WALLET_APP_EVENTS.SESSION_UPDATE);
      }
      resolve(newConnector);
    }
    // If we're already connected but the session is expired (or times are missing), kill it
    else if (connected && !connectionDateValue) {
      connector.killSession();
    }
  }
};
