export const BROWSER_EVENTS = {
  BASIC: 'basic',
  DISCONNECT: 'disconnect',
  HIDDEN: 'hidden',
  RESET_TIMEOUT: 'resetConnectionTimeout',
  RESUME_CONNECTION: 'resumeConnection',
} as const;

// Window message event name when communicating with figureHosted/extension wallets
export const CUSTOM_EVENT_HOSTED = 'figureWalletHostedSendMessage';
export const CUSTOM_EVENT_EXTENSION = 'figureWalletExtensionSendMessage';

// Who is sending the window message
export const BROWSER_MESSAGE_SENDERS = {
  WCJS: 'wcjs',
  EXTENSION: 'extension',
  'CONTENT-SCRIPT': 'content-script',
} as const;