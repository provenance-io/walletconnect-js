import type { ConnectData, ConnectMethodResults } from '../../../../../types';
import { walletConnectAccountInfo } from '../../../../../utils';

interface ConnectEventParams {
  payload: ConnectData;
}

// ------------------------
// CONNECT EVENT
// ------------------------
// - Calculate new connection EST/EXP
// - Save accounts (account data), peer, connection EST/EXP, and connected value to walletConnectService
// - Broadcast "connect" event (let the dApp know)
// - Start the "connection timer" to auto-disconnect wcjs when session is expired
// - Trigger wallet event for "connect" (let the wallet know)
export const connectEvent = ({ payload }: ConnectEventParams) => {
  const results: ConnectMethodResults = {};

  const data = payload.params[0];
  const { accounts, peerMeta: peer } = data;
  const {
    address,
    attributes,
    jwt: signedJWT,
    publicKey,
    representedGroupPolicy,
    walletInfo,
  } = walletConnectAccountInfo(accounts);
  const { coin, id, name } = walletInfo;
  results.state = {
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

  return results;
};
