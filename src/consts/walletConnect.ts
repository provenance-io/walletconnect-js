import { ConnectionType } from '../types';

export const CONNECTOR_EVENTS = {
  connect: 'connect',
  disconnect: 'disconnect',
  session_request: 'session_request',
  session_update: 'session_update',
  call_request: 'call_request',
  wc_sessionRequest: 'wc_sessionRequest',
  wc_sessionUpdate: 'wc_sessionUpdate',
} as const;

export const CONNECTION_TYPES: {
  existing_session: ConnectionType;
  new_session: ConnectionType;
} = {
  existing_session: 'existing session',
  new_session: 'new session',
} as const;
