export type EventValueNames = 'RESET_TIMEOUT' | 'DISCONNECT' | 'EVENT' | 'INIT';
export type EventValue =
  | 'walletconnect_event'
  | 'walletconnect_init'
  | 'walletconnect_disconnect'
  | 'resetConnectionTimeout';
export type EventOptions = { [Key in EventValueNames]: EventValue };
export type WalletType = 'mobile' | 'extension' | 'web';
export type WalletId =
  | 'provenance_extension'
  | 'provenance_mobile'
  | 'figure_web'
  | 'figure_mobile'
  | 'figure_web_test'
  | 'figure_mobile_test';
export type WalletIcons = 'provenance' | 'figure';

export type CustomEventData =
  | { [key: string]: Record<string, unknown> }
  | string
  | number
  | [];

export interface EventData {
  event?: EventValue;
  uri?: string;
  address?: string;
  duration?: number;
  data?: CustomEventData;
  referral?: string;
}

export interface Wallet {
  dev?: boolean; // Is this wallet still in development?  If true, QRCode modal won't render by default
  dynamicUrl?: string; // The result of generateUrl, the dyanmic url for mobile users.
  eventAction?: (eventData: EventData) => void; // Callback function for every walletconnect-js method/action
  generateUrl?: (QRCodeUrl: string) => Promise<string>; // Function to generate a dynamic URL for mobile users
  icon?: WalletIcons; // Icon to display next to the wallet selection
  id: WalletId; // Id to reference this specific wallet
  title: string; // Title to display when selecting wallets
  type: WalletType; // Is this wallet mobile, web, or an extension
  walletCheck?: () => boolean; // Check if the wallet exists, runs background actions as needed, returns a boolean indicating existance
  walletUrl?: string; // Location of wallet download
}

export type WalletList = Wallet[];
