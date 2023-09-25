export const BROWSER_EVENTS = {
  BASIC: 'basic',
  DISCONNECT: 'disconnect',
  HIDDEN: 'hidden',
  RESET_TIMEOUT: 'resetConnectionTimeout',
} as const;

// Window message event name when communicating with figureHosted/extension wallets
export const CUSTOM_EVENT_HOSTED = 'figureWalletHostedSendMessage';
export const CUSTOM_EVENT_EXTENSION = 'figureWalletExtensionSendMessage';
