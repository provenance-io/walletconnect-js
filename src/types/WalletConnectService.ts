import type WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type { MasterGroupPolicy, WalletInfo } from './ConnectData';

export type WalletConnectClientType = WalletConnectClient;

type WCSLoadingValue = '' | 'sendMessage' | 'signJWT' | 'signMessage';

export interface WCSState {
  address: string;
  bridge: string;
  connected: boolean;
  connectionPending: boolean;
  connectionEXP: number | null;
  connectionEST: number | null;
  connectionTimeout: number;
  connector: WalletConnectClientType | null;
  isMobile: boolean;
  loading: WCSLoadingValue;
  peer: IClientMeta | null;
  publicKey: string;
  QRCode: string;
  QRCodeUrl: string;
  showQRCodeModal: boolean;
  signedJWT: string;
  walletAppId?: WalletId | '';
  walletInfo: WalletInfo;
  representedGroupPolicy: MasterGroupPolicy | null;
}

export type WCSSetState = (state: Partial<WCSState>) => void;
export type WCSSetFullState = (state: WCSState) => void;

export interface WCJSLocalState {
  connectionEXP: number;
  connectionEST: number;
  connectionTimeout: number;
  signedJWT: string;
  walletAppId?: WalletId | '';
}
