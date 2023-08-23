import WalletConnectClient from '@walletconnect/client';
import { WalletAction } from '../consts/walletActions';
import type { ProvenanceMethod } from './Broadcast';
import type {
  AccountAttribute,
  AccountObject,
  MasterGroupPolicy,
  WalletInfo,
} from './ConnectData';
import type { GasPrice } from './GasPriceType';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';

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
  QRCodeImg: string;
  QRCodeUrl: string;
  showModal: boolean;
  isMobile: boolean;
  dynamicUrl: string;
}

export interface WCSState {
  address: string;
  attributes: AccountAttribute[];
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
  version: string;
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
export interface WalletConnectInitMethod {
  bridge?: string;
  duration?: number;
  noPopup?: boolean;
  individualAddress?: string;
  groupAddress?: string;
  prohibitGroups?: boolean;
  jwtExpiration?: number;
  walletAppId?: WalletId;
  state: WCSState;
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

export type UpdateModalData = Partial<ModalData> & { walletAppId?: WalletId };
