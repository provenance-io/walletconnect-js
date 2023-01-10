import { ConnectionType } from '../types';

export const CONNECTOR_EVENTS = {
  session_request: 'session_request',
  session_update: 'session_update',
  exchange_key: 'exchange_key',
  connect: 'connect',
  disconnect: 'disconnect',
  display_uri: 'display_uri',
  modal_closed: 'modal_closed',
  transport_open: 'transport_open',
  transport_close: 'transport_close',
  transport_error: 'transport_error',
};

export const CONNECTION_TYPES: {
  existing_session: ConnectionType;
  new_session: ConnectionType;
} = {
  existing_session: 'existing session',
  new_session: 'new session',
};
