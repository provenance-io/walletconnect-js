export const BROWSER_EVENTS = {
  RESET_TIMEOUT: 'resetConnectionTimeout',
  DISCONNECT: 'disconnect',
  BASIC: 'basic',
  HIDDEN: 'hidden',
} as const;

// Window message event name when communicating with figureHosted/extension wallets
export const CUSTOM_EVENT_HOSTED = 'figureWalletHostedSendMessage';
export const CUSTOM_EVENT_EXTENSION = 'figureWalletExtensionSendMessage';
