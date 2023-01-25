import WalletConnectClient from '@walletconnect/client';
import { getAccountInfo } from '../../../utils';
import type { Broadcast, WCSState, WCSSetState } from '../../../types';
import { sessionUpdateEvent } from './sessionUpdateEvent';

interface Props {
  broadcast: Broadcast;
  connector: WalletConnectClient;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}

export const updateService = ({
  broadcast,
  connector,
  setState,
  startConnectionTimer,
  state,
}: Props) => {
  const { accounts, peerMeta: peer } = connector;
  const {
    address,
    publicKey,
    jwt: lastConnectJWT,
    walletInfo,
    representedGroupPolicy,
  } = getAccountInfo(accounts);
  const signedJWT = state.signedJWT || lastConnectJWT;
  // Are we already connected, run the session_update event
  if (connector.connected) {
    sessionUpdateEvent({
      broadcast,
      connector,
      setState,
      startConnectionTimer,
      state,
    });
  }
  // Update WalletConnectService State w/latest info
  setState({
    address,
    bridge: connector.bridge,
    connected: connector.connected,
    connector,
    peer,
    publicKey,
    signedJWT,
    walletInfo,
    representedGroupPolicy,
  });
};
