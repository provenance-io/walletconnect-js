import { WALLET_ICONS, WALLET_IDS, WALLET_TYPES } from '../consts';
import { MasterGroupPolicy } from './MasterGroupPolicy';
import { WalletMessageRequest, WalletMessageResponse } from './WalletMessaging';

export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];
export type WalletId = typeof WALLET_IDS[keyof typeof WALLET_IDS];

// TODO: This should be a cdn url to download the icon
// Currently just points to a local file name
export type WalletIcons = typeof WALLET_ICONS[keyof typeof WALLET_ICONS];

export interface Wallet {
  dev?: boolean; // Is this wallet still in development?  If true, QRCode modal won't render by default
  icon?: WalletIcons; // Icon to display next to the wallet selection
  id: WalletId; // Id to reference this specific wallet
  title: string; // Title to display when selecting wallets
  type: WalletType; // Is this wallet mobile, web, or an extension
  // -----------------------------
  // Browser wallet functions/keys
  // -----------------------------
  browserEventAction?: (
    eventData: WalletMessageRequest
  ) => Promise<WalletMessageResponse>; // Callback function for every walletconnect-js method/action
  walletCheck?: () => boolean; // Check if the wallet exists, runs background actions as needed, returns a boolean indicating existance
  walletUrl?: string; // Location of wallet download
  walletUrls?: Record<string, string>; // Location of wallet download based on browser
  // -----------------------------
  // walletconnect functions/keys
  // -----------------------------
  dynamicUrl?: string; // The result of generateUrl, the dyanmic url for mobile users.
  generateUrl?: (QRCodeUrl: string) => string; // Function to generate a dynamic URL for mobile users
}

export type WalletList = Wallet[];

// This structure is due to walletconnect
export type WalletInfo = {
  coin?: string;
  id?: number;
  name?: string;
};

export interface AccountAttribute {
  name: string;
  value: number;
  type: string;
}

export type AccountObject = {
  address: string;
  attributes: AccountAttribute[];
  jwt: string;
  publicKey: string;
  representedGroupPolicy?: MasterGroupPolicy;
  walletInfo: WalletInfo;
};
