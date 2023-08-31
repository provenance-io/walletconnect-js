import { ConnectData, ConnectMethodResults } from '../../../../../types';
import { walletConnectAccountInfo } from '../../../../../utils';

// ------------------------
// UPDATE SESSION EVENT
// ------------------------
// - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
// - Broadcast "session_update" event (let the dApp know)
// - Start the "connection timer" to auto-disconnect wcjs when session is expired
// - Trigger wallet event for "session_update" (let the wallet know)

interface SessionUpdateEventParams {
  payload: ConnectData;
}

export const sessionUpdateEvent = ({ payload }: SessionUpdateEventParams) => {
  const connectResults: ConnectMethodResults = {
    error: 'Connection failed, unknown error',
  };
  const data = payload.params[0];
  const { accounts, peerMeta: peer } = data;
  if (!accounts) {
    //if no accounts, likely a post disconnect update - bail
    return;
  }
  // Pull out all known information about the current account
  const {
    address,
    attributes,
    jwt: signedJWT,
    publicKey,
    representedGroupPolicy,
    walletInfo,
  } = walletConnectAccountInfo(accounts);
  const { coin, id, name } = walletInfo;
  // Save pulled information into wcjs state
  connectResults.state = {
    wallet: {
      address,
      attributes,
      publicKey,
      representedGroupPolicy,
      signedJWT,
      coin,
      id,
      name,
    },
    connection: {
      status: 'connected',
      peer,
    },
  };
};
