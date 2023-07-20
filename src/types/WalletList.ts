import { WALLET_APP_EVENTS } from '../consts';

export type WalletEventKey = keyof typeof WALLET_APP_EVENTS;
export type WalletEventValue = typeof WALLET_APP_EVENTS[WalletEventKey];
export type WalletType = 'mobile' | 'extension' | 'hosted';
export type WalletId =
  | 'figure_extension'
  | 'figure_hosted'
  | 'figure_hosted_test'
  | 'figure_mobile'
  | 'figure_mobile_test';
export type WalletIcons = 'provenance' | 'figure';

export type WalletEventData = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface EventData {
  event?: WalletEventValue;
  uri?: string;
  address?: string;
  duration?: number;
  data?: WalletEventData;
  referral?: string;
  redirectUrl?: string;
}

export interface Wallet {
  dev?: boolean; // Is this wallet still in development?  If true, QRCode modal won't render by default
  dynamicUrl?: string; // The result of generateUrl, the dyanmic url for mobile users.
  eventAction?: (eventData: EventData) => void; // Callback function for every walletconnect-js method/action
  generateUrl?: (QRCodeUrl: string) => string; // Function to generate a dynamic URL for mobile users
  icon?: WalletIcons; // Icon to display next to the wallet selection
  id: WalletId; // Id to reference this specific wallet
  title: string; // Title to display when selecting wallets
  type: WalletType | WalletType[]; // Is this wallet mobile, web, or an extension
  walletCheck?: () => boolean; // Check if the wallet exists, runs background actions as needed, returns a boolean indicating existance
  walletUrl?: string; // Location of wallet download
  walletUrls?: Record<string, string>; // Location of wallet download based on browser
}

export type WalletList = Wallet[];
