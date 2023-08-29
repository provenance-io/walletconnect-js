import type WalletConnectClient from '@walletconnect/client';
import type { ProvenanceMethod } from './Broadcast';
import type {
  AccountAttribute,
  AccountObject,
  MasterGroupPolicy,
} from './ConnectData';
import type { GasPrice } from './GasPriceType';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';

export type WalletConnectClientType = WalletConnectClient;

type PendingMethod =
  | ''
  | 'sendMessage'
  | 'signJWT'
  | 'signHexMessage'
  | 'switchToGroup'
  | 'removePendingMethod';

export type ConnectionStatus = 'connected' | 'disconnected' | 'pending';
export type ConnectionType = 'mobile' | 'browser';

export interface ModalState {
  dynamicUrl?: string;
  isMobile: boolean;
  QRCodeImg?: string;
  QRCodeUrl?: string;
  show: boolean;
}

export interface WalletState {
  address?: string;
  attributes: AccountAttribute[];
  coin?: string;
  id?: number;
  name?: string;
  publicKey?: string;
  representedGroupPolicy?: MasterGroupPolicy;
  signedJWT?: string;
}
export interface ConnectionState {
  bridge: string;
  est?: number;
  exp?: number;
  timeout: number;
  type?: ConnectionType;
  onDisconnect?: (message?: string) => void;
  peer?: IClientMeta;
  pendingMethod?: PendingMethod;
  status: ConnectionStatus;
  walletAppId?: WalletId;
}

export interface WCSState {
  connection: ConnectionState;
  modal: ModalState;
  wallet: WalletState;
}

export interface WCSSetStateParam extends WCSState {
  connector?: WalletConnectClient;
}

export type PartialState<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

export type WCSSetState = (
  state: Partial<WCSState>,
  updateLocalStorage?: boolean
) => void;
export type WCSSetFullState = (state: WCSState) => void;

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
  onDisconnect?: (message?: string) => void;
}

export interface ConnectMethodResults {
  state?: Partial<WCSState>;
  error?: string;
  resetState?: boolean;
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

export type UpdateModalData = Partial<ModalState> & { walletAppId?: WalletId };

export type WalletAction = 'switchToGroup' | 'removePendingMethod';
