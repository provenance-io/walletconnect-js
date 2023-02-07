import WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type { AccountObject, MasterGroupPolicy, WalletInfo } from './ConnectData';

export type WalletConnectClientType = WalletConnectClient;

type WCSPendingMethod = '' | 'sendMessage' | 'signJWT' | 'signHexMessage';

export type WalletConnectServiceStatus = 'connected' | 'disconnected' | 'pending';

export interface ModalData {
  QRCode: string;
  QRCodeUrl: string;
  showModal: boolean;
  isMobile: boolean;
}

export interface WCSState {
  address: string;
  bridge: string;
  status: WalletConnectServiceStatus;
  connectionEXP: number | null;
  connectionEST: number | null;
  connectionTimeout: number;
  pendingMethod: WCSPendingMethod;
  peer: IClientMeta | null;
  publicKey: string;
  modal: ModalData;
  signedJWT: string;
  walletAppId?: WalletId;
  walletInfo: WalletInfo;
  representedGroupPolicy: MasterGroupPolicy | null;
}

export interface WCSSetStateParam extends WCSState {
  connector?: WalletConnectClient;
}

export type WCSSetState = (
  state: Partial<WCSSetStateParam>,
  updateLocalStorage?: boolean
) => void;
export type WCSSetFullState = (state: WCSState) => void;

export interface WCJSLocalState {
  connectionEXP: number;
  connectionEST: number;
  connectionTimeout: number;
  signedJWT: string;
  walletAppId?: WalletId | '';
}

export interface WCLocalState {
  connected: boolean;
  accounts: AccountObject[];
  chainId: number;
  bridge: string;
  key: string;
  clientId: string;
  clientMeta: IClientMeta | null;
  peerId: string;
  peerMeta: IClientMeta | null;
  handshakeId: number;
  handshakeTopic: string;
}

export type WCJSLocalStateKeys = keyof WCJSLocalState;
export type WCLocalStateKeys = keyof WCLocalState;
