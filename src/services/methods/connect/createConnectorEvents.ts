import WalletConnectClient from '@walletconnect/client';
import { CONNECTOR_EVENTS } from '../../../consts';
import type { Broadcast, WCSState, WCSSetState } from '../../../types';
import { connectEvent } from './connectEvent';
import { disconnectEvent } from './disconnectEvent';
import { sessionUpdateEvent } from './sessionUpdateEvent';

interface Props {
  bridge: string;
  broadcast: Broadcast;
  connector: WalletConnectClient;
  getState: () => WCSState;
  resetState: () => void;
  setState: WCSSetState;
  startConnectionTimer: () => void;
  state: WCSState;
}
// Walletconnect connectors can hold events, we want to listen for session_update, connect, and disconnect
export const createConnectorEvents = ({
  bridge,
  broadcast,
  connector,
  getState,
  resetState,
  setState,
  startConnectionTimer,
  state,
}: Props) => {
  if (!connector) return;
  connector.on(CONNECTOR_EVENTS.session_update, (error) => {
    if (error) throw error;
    return sessionUpdateEvent({
      broadcast,
      connector,
      setState,
      startConnectionTimer,
      state,
    });
  });
  connector.on(CONNECTOR_EVENTS.connect, (error, payload) => {
    if (error) throw error;
    return connectEvent({
      bridge,
      broadcast,
      connector,
      payload,
      setState,
      startConnectionTimer,
      state,
    });
  });
  connector.on(CONNECTOR_EVENTS.disconnect, (error) => {
    if (error) throw error;
    return disconnectEvent({ getState, broadcast, resetState });
  });
};
