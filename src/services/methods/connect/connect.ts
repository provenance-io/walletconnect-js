import { createConnector } from './createConnector';
import type { Broadcast, WCSState, WCSSetState, ModalData } from '../../../types';

interface Props {
  bridge: string;
  broadcast: Broadcast;
  getState: () => WCSState;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  requiredAddress?: string;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
  updateModal: (newModalData: Partial<ModalData>) => void;
}

// This connect method has three parts:
// Creating a new connector w/connector.on() events (connect, session_update, and disconnect)
// Update the walletConnectService state with the newly created connector
// If we're not already connected, start a new session (Triggers a connect modal popup)
export const connect = ({
  bridge,
  broadcast,
  getState,
  noPopup,
  prohibitGroups,
  requiredAddress,
  resetState,
  setState,
  state,
  startConnectionTimer,
  updateModal,
}: Props) => {
  // Create a new walletconnect connector class and set up all walletconnect event listeners for it
  const newConnector = createConnector({
    bridge,
    broadcast,
    getState,
    noPopup,
    prohibitGroups,
    requiredAddress,
    resetState,
    setState,
    state,
    startConnectionTimer,
    updateModal,
  });

  // If we're not connected, initiate a connection to this newConnector and dApp
  if (!newConnector.connected) newConnector.createSession();

  return newConnector;
};
