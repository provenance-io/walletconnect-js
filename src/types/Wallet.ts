import { WALLET_ICONS, WALLET_IDS, WALLET_TYPES } from '../consts';
import {
  BrowserWalletEventActionRequests,
  BrowserWalletEventActionResponses,
} from './BrowserWallet/Methods/Generic';
import { ProvenanceMethod } from './Cosmos';
import { MasterGroupPolicy } from './MasterGroupPolicy';
// import { WalletMessageRequest, WalletMessageResponse } from './WalletMessaging';

export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];
export type WalletId = typeof WALLET_IDS[keyof typeof WALLET_IDS];

// TODO: This should be a cdn url to download the icon
// Currently just points to a local file name
export type WalletIcons = typeof WALLET_ICONS[keyof typeof WALLET_ICONS];

interface BasicWallet {
  dev?: boolean; // Is this wallet still in development?  If true, QRCode modal won't render by default
  icon?: WalletIcons; // Icon to display next to the wallet selection
  id: WalletId; // Id to reference this specific wallet
  title: string; // Title to display when rendering UI of wallets
  type: WalletType; // How does wcjs communicate w/wallet (wc vs browser messaging)
}

export type BrowserWallet = BasicWallet & {
  browserEventAction: <M extends ProvenanceMethod>(
    request: BrowserWalletEventActionRequests[M],
    method: M
  ) => Promise<BrowserWalletEventActionResponses[M]>;
  walletCheck?: () => boolean; // Check if the wallet exists, runs background actions as needed, returns a boolean indicating existance
  walletUrls?: Record<string, string>; // Url to download wallet based on browser
};

export type WCWallet = BasicWallet & {
  dynamicUrl?: string; // The result of generateUrl, the dyanmic url for mobile users.
  generateUrl?: (QRCodeUrl: string) => string; // Function to generate a dynamic URL for mobile users
};

export type FullWallet = Partial<BrowserWallet> & Partial<WCWallet>;

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

export type WalletConnectAccountInfo = string[] | AccountObject[] | undefined;
