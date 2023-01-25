import WalletConnectClient from '@walletconnect/client';
import { getAccountInfo } from '../../../utils';
import type { Broadcast, WCSState, WCSSetState } from '../../../types';
import { CONNECTION_TYPES, WINDOW_MESSAGES } from '../../../consts';

interface Props {
  broadcast: Broadcast;
  connector: WalletConnectClient;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}

export const sessionUpdateEvent = ({
  connector,
  state,
  setState,
  broadcast,
  startConnectionTimer,
}: Props) => {
  // Get connection issued time
  const connectionEST = Date.now();
  const connectionEXP = state.connectionEXP;
  // If the session is already expired (re-opened closed/idle tab), kill the session
  if (!connectionEXP || connectionEST >= connectionEXP) {
    connector.killSession();
    return '';
  } else {
    const { accounts, peerMeta: peer } = connector;
    const {
      address,
      publicKey,
      jwt: lastConnectJWT,
      walletInfo,
      representedGroupPolicy,
    } = getAccountInfo(accounts);
    const signedJWT = state.signedJWT || lastConnectJWT;
    setState({
      address,
      bridge: connector.bridge,
      publicKey,
      connected: connector.connected,
      signedJWT,
      peer,
      connectionEST,
      walletInfo,
      representedGroupPolicy,
    });
    const broadcastData = {
      connector,
      connectionEST,
      connectionEXP: state.connectionEXP || 0,
      connectionType: CONNECTION_TYPES.existing_session,
    };
    broadcast(WINDOW_MESSAGES.CONNECTED, { data: broadcastData });
    // Start the auto-logoff timer
    startConnectionTimer();
    // TEST: Testing a return of the broadcast data
    return broadcastData;
  }
  return '';
};
