import WalletConnectClient from '@walletconnect/client';
import { getAccountInfo } from '../../../utils';
import type { Broadcast, WCSState, WCSSetState, ConnectData } from '../../../types';
import { CONNECTION_TYPES, WINDOW_MESSAGES } from '../../../consts';

interface Props {
  bridge: string;
  broadcast: Broadcast;
  connector: WalletConnectClient;
  payload: ConnectData;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}

export const connectEvent = ({
  bridge,
  broadcast,
  payload,
  setState,
  startConnectionTimer,
  state,
}: Props) => {
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
  // TEST: Testing a return of the broadcast data
  return broadcastData;
};
