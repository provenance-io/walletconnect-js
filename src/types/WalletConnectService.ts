import type WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type {MasterGroupPolicy, WalletInfo} from './ConnectData';

export type WalletConnectClientType = WalletConnectClient;

type WCSLoadingValue = '' | 'sendMessage' | 'signJWT' | 'signMessage';

export interface WCSState {
  account: string;
  address: string;
  bridge: string;
  connected: boolean;
  connectionEXP: number | null;
  connectionEST: number | null;
  connectionTimeout: number;
  connector: WalletConnectClientType | null;
  figureConnected: boolean;
  isMobile: boolean;
  loading: WCSLoadingValue;
  newAccount: boolean;
  peer: IClientMeta | null;
  publicKey: string;
  QRCode: string;
  QRCodeUrl: string;
  showQRCodeModal: boolean;
  signedJWT: string;
  walletApp?: WalletId | '';
  walletInfo: WalletInfo;
  representedGroupPolicy: MasterGroupPolicy;
}

export type WCSSetState = (state: Partial<WCSState>) => void;
export type WCSSetFullState = (state: WCSState) => void;

export interface WCJSLocalState {
  account: string;
  connectionEXP: number;
  connectionEST: number;
  connectionTimeout: number;
  figureConnected: boolean;
  newAccount: false;
  signedJWT: string;
  walletApp?: WalletId | '';
}
