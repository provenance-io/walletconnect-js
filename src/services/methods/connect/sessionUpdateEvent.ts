import WalletConnectClient from '@walletconnect/client';
import { getAccountInfo } from '../../../utils';
import type { ConnectorEventData } from '../../../types';
import { CONNECTION_TYPES, WINDOW_MESSAGES } from '../../../consts';

interface Props {
  connectionEST: number;
  connectionEXP: number;
  connector: WalletConnectClient;
  signedJWT?: string;
}

export const sessionUpdateEvent = ({
  connectionEST,
  connectionEXP,
  connector,
  signedJWT: existingSignedJWT,
}: Props): ConnectorEventData => {
  const { accounts, peerMeta: peer } = connector;
  const {
    address,
    jwt: newJWT,
    publicKey,
    representedGroupPolicy,
    walletInfo,
  } = getAccountInfo(accounts);
  const signedJWT = existingSignedJWT || newJWT;
  const stateData = {
    address,
    bridge: connector.bridge,
    connected: connector.connected,
    connectionEST,
    peer,
    publicKey,
    representedGroupPolicy,
    signedJWT,
    walletInfo,
  };
  const broadcastData = {
    payload: {
      data: {
        connectionEXP,
        connectionEST,
        connectionType: CONNECTION_TYPES.existing_session,
      },
    },
    eventName: WINDOW_MESSAGES.CONNECTED,
  };

  return { stateData, broadcastData };
};
