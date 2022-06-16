export type EventValue = 'walletconnect_event' | 'walletconnect_init';
export type WalletType = 'mobile' | 'extension' | 'web';
export type WalletId = 'provenance_extension' | 'provenance_mobile' | 'figure_web';
export type WalletIcons = 'provenance' | 'figure' | 'unicorn';

export interface EventData {
  event?: EventValue,
  uri?: string,
  address?: string,
  customExtId?: string,
}

export interface Wallet {
  dev?: boolean, // Is this wallet still in development?  If true, QRCode modal won't render by default
  id: WalletId, // Id to reference this specific wallet
  title: string, // Title to display when selecting wallets
  type: WalletType, // Is this wallet mobile, web, or an extension
  extensionId?: string, // If this is an extension, what is the extension id
  icon?: WalletIcons, // Icon to display next to the wallet selection
  eventAction?: (eventData: EventData) => void, // Callback function for every walletconnect-js method/action
  generateUrl?: (QRCodeUrl: string) => Promise<string>, // Function to generate a dynamic URL for mobile users
  dynamicUrl?: string, // The result of generateUrl, the dyanmic url for mobile users.
}

export type WalletList = Wallet[];