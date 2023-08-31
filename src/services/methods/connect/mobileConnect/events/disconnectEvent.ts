import { WCSState, WalletConnectEventDisconnect } from '../../../../../types';

interface DisconnectParams {
  payload: WalletConnectEventDisconnect;
  resetState: () => void;
  getState: () => WCSState;
}

// ------------------------
// DISCONNECT EVENT
// ------------------------
// - Trigger wallet event for "disconnect" (let the wallet know)
// - Reset the walletConnectService state to default values
// - Broadcast "disconnect" event (let the dApp know)
export const disconnectEvent = ({ payload, resetState }: DisconnectParams) => {
  resetState();
};
