import WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type {
  AccountObject,
  MasterGroupPolicy,
  WalletInfo,
  AccountAttribute,
} from './ConnectData';
import type { ProvenanceMethod } from './Broadcast';
import type { GasPrice } from './GasPriceType';
import { WalletAction } from '../consts/walletActions';

export type WalletConnectClientType = WalletConnectClient;

type WCSPendingMethod =
  | ''
  | 'sendMessage'
  | 'signJWT'
  | 'signHexMessage'
  | 'switchToGroup'
  | 'removePendingMethod';

export type WalletConnectServiceStatus = 'connected' | 'disconnected' | 'pending';

export interface ModalData {
  dynamicUrl: string;
  isMobile: boolean;
  QRCodeImg: string;
  QRCodeUrl: string;
  showModal: boolean;
}

export interface WCSState {
  address: string;
  attributes: AccountAttribute[];
  bridge: string;
  connected: boolean;
  connectionEST: number | null;
  connectionEXP: number | null;
  connectionTimeout: number;
  iframeParentId?: string;
  modal: ModalData;
  peer: IClientMeta | null;
  pendingMethod: WCSPendingMethod;
  publicKey: string;
  representedGroupPolicy: MasterGroupPolicy | null;
  signedJWT: string;
  status: WalletConnectServiceStatus;
  version: string;
  walletAppId?: WalletId;
  walletInfo: WalletInfo;
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
  connectionEST: number;
  connectionEXP: number;
  connectionTimeout: number;
  iframeParentId?: string;
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

export interface ConnectMethod {
  bridge?: string;
  duration?: number;
  noPopup?: boolean;
  individualAddress?: string;
  groupAddress?: string;
  prohibitGroups?: boolean;
  jwtExpiration?: number;
  walletAppId?: WalletId;
}
export interface InitMethod {
  bridge?: string;
  duration?: number;
  groupAddress?: string;
  iframeParentId?: string;
  individualAddress?: string;
  jwtExpiration?: number;
  noPopup?: boolean;
  prohibitGroups?: boolean;
  walletAppId?: WalletId;
}

export interface SendMessageMethod {
  customId?: string;
  description?: string;
  extensionOptions?: string[];
  feeGranter?: string;
  feePayer?: string;
  gasPrice?: GasPrice;
  memo?: string;
  message: string | string[];
  method?: ProvenanceMethod;
  nonCriticalExtensionOptions?: string[];
  timeoutHeight?: number;
}

export interface SendWalletActionMethod {
  method?: ProvenanceMethod;
  description?: string;
  action: WalletAction;
  payload?: Record<string, unknown>;
}
