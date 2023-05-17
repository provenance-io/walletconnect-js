import { createConnector } from './createConnector';
import type {
  BroadcastEventName,
  BroadcastEventData,
  WCSState,
  WCSSetState,
  ModalData,
  WalletId,
} from '../../../types';

interface Props {
  bridge: string;
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
  duration: number;
  getState: () => WCSState;
  jwtExpiration?: number;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  requiredIndividualAddress?: string;
  requiredGroupAddress?: string;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
  updateModal: (
    newModalData: Partial<ModalData> & { walletAppId?: WalletId }
  ) => void;
  walletAppId?: WalletId;
}

// This connect method has three parts:
// Creating a new connector w/connector.on() events (connect, session_update, and disconnect)
// Update the walletConnectService state with the newly created connector
// If we're not already connected, start a new session (Triggers a connect modal popup)
export const connect = ({
  bridge,
  broadcast,
  duration,
  getState,
  jwtExpiration,
  prohibitGroups,
  requiredIndividualAddress,
  requiredGroupAddress,
  resetState,
  setState,
  startConnectionTimer,
  state,
  updateModal,
  walletAppId,
}: Props) => {
  // Create a new walletconnect connector class and set up all walletconnect event listeners for it
  const newConnector = createConnector({
    bridge,
    broadcast,
    duration,
    getState,
    jwtExpiration,
    prohibitGroups,
    requiredIndividualAddress,
    requiredGroupAddress,
    resetState,
    setState,
    state,
    startConnectionTimer,
    updateModal,
    walletAppId,
  });

  // If we're not connected, initiate a connection to this newConnector and dApp
  if (!newConnector.connected) {
    newConnector.createSession();
  }

  return newConnector;
};
