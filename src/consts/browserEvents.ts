export const BROWSER_EVENTS = {
  CONNECT: 'connect',
  SESSION_UPDATE: 'update',
  RESET_TIMEOUT: 'resetConnectionTimeout',
  DISCONNECT: 'disconnect',
  EVENT: 'basic_event',
  INIT: 'init',
} as const;

// Window message event name when communicating with figureHosted/extension wallets
export const CUSTOM_EVENT_HOSTED = 'figureWalletHostedSendMessage';
export const CUSTOM_EVENT_EXTENSION = 'figureWalletExtensionSendMessage';
