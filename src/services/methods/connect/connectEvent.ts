import { getAccountInfo } from '../../../utils';
import type { WCSState, ConnectData, ConnectorEventData } from '../../../types';
import { CONNECTION_TYPES, WINDOW_MESSAGES } from '../../../consts';

interface Props {
  bridge: string;
  payload: ConnectData;
  state: WCSState;
}

export const connectEvent = ({
  bridge,
  payload,
  state,
}: Props): ConnectorEventData => {
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
  const stateData = {
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
  };
  const broadcastData = {
    eventName: WINDOW_MESSAGES.CONNECTED,
    payload: {
      data: {
        connectionEST,
        connectionEXP,
        connectionType: CONNECTION_TYPES.new_session,
      },
    },
  };

  return {
    stateData,
    broadcastData,
  };
};
