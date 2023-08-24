import { WALLET_APP_EVENTS, WINDOW_MESSAGES } from '../../../../../consts';
import {
  BroadcastEventData,
  BroadcastEventName,
  WCSState,
  WalletConnectEventDisconnect,
} from '../../../../../types';
import { sendWalletEvent } from '../../../../../utils';

interface DisconnectParams {
  payload: WalletConnectEventDisconnect;
  resetState: () => void;
  getState: () => WCSState;
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
}

// ------------------------
// DISCONNECT EVENT
// ------------------------
// - Trigger wallet event for "disconnect" (let the wallet know)
// - Reset the walletConnectService state to default values
// - Broadcast "disconnect" event (let the dApp know)
export const disconnectEvent = ({
  payload,
  resetState,
  broadcast,
  getState,
}: DisconnectParams) => {
  const { walletAppId } = getState();
  if (walletAppId) sendWalletEvent(walletAppId, WALLET_APP_EVENTS.DISCONNECT);
  resetState();
  broadcast(WINDOW_MESSAGES.DISCONNECT, {
    result: payload.params[0],
  });
};
