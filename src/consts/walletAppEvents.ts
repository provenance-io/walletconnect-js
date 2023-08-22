export const WALLET_APP_EVENTS = {
  CONNECT: 'walletconnect_connect',
  SESSION_UPDATE: 'walletconnect_session_update',
  RESET_TIMEOUT: 'resetConnectionTimeout',
  DISCONNECT: 'walletconnect_disconnect',
  EVENT: 'walletconnect_event',
  INIT: 'walletconnect_init',
} as const;

export const WALLET_APP_EVENTS_NEW = {
  CONNECT: 'connect',
  SESSION_UPDATE: 'update',
  RESET_TIMEOUT: 'resetConnectionTimeout',
  DISCONNECT: 'disconnect',
  EVENT: 'basic_event',
  INIT: 'init',
} as const;
