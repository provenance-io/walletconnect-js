import { WalletMessageRequest, WalletMessageResponse } from './WalletMessaging';

export type WalletType = 'mobile' | 'extension' | 'hosted';

export type WalletMessaging = 'browser' | 'walletconnect';

export type WalletId =
  | 'figure_extension'
  | 'figure_hosted'
  | 'figure_hosted_test'
  | 'figure_mobile'
  | 'figure_mobile_test';

// TODO: This should be a cdn url to download the icon
export type WalletIcons = 'figure';

export interface Wallet {
  dev?: boolean; // Is this wallet still in development?  If true, QRCode modal won't render by default
  icon?: WalletIcons; // Icon to display next to the wallet selection
  id: WalletId; // Id to reference this specific wallet
  title: string; // Title to display when selecting wallets
  type: WalletType | WalletType[]; // Is this wallet mobile, web, or an extension
  messaging: WalletMessaging; // How does this wallet communicate with the dApp
}
export type BrowserWallet = Wallet & {
  browserEventAction: (
    eventData: WalletMessageRequest
  ) => Promise<WalletMessageResponse>; // Callback function for every walletconnect-js method/action
  walletCheck?: () => boolean; // Check if the wallet exists, runs background actions as needed, returns a boolean indicating existance
  walletUrl?: string; // Location of wallet download
  walletUrls?: Record<string, string>; // Location of wallet download based on browser
};
export type WalletConnectWallet = Wallet & {
  dynamicUrl?: string; // The result of generateUrl, the dyanmic url for mobile users.
  generateUrl?: (QRCodeUrl: string) => string; // Function to generate a dynamic URL for mobile users
};

export type WalletList = (BrowserWallet | WalletConnectWallet)[];
