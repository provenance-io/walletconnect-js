import { CONNECTOR_EVENTS } from '../../../consts';
import { connectEvent } from './connectEvent';
import { disconnectEvent } from './disconnectEvent';
import { sessionUpdateEvent } from './sessionUpdateEvent';
import { createConnector } from './createConnector';
import type {
  Broadcast,
  WCSState,
  WCSSetState,
  ConnectorEventData,
} from '../../../types';

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
}

// This connect method has three parts:
// Creating a new connector
// Setting up the new connector.on() events (connect, session_update, and disconnect)
// Note: connector.on() events are unpredicably async
// Manually run session_update event action to update walletConnectService state (instead of waiting for connector.on() event)
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
  });

  // Save this new connector into walletConnectService state
  setState({ connector: newConnector });

  // If we're not connected, initiate a connection to this newConnector and dApp
  if (!newConnector.connected) newConnector.createSession();
};
