import type WalletConnectClient from '@walletconnect/client';
import type {
  AccountAttribute,
  AccountObject,
  MasterGroupPolicy,
} from './ConnectData';
import type { GasPrice } from './Cosmos';
import type { WalletId } from './Wallet';
import type { ProvenanceMethod } from './WalletMessaging';

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

export type IClientMeta = {
  description: string;
  url: string;
  icons: string[];
  name: string;
};

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
  connectionDuration: number;
  jwtDuration: number;
  type?: ConnectionType;
  onDisconnect?: (message?: string) => void;
  peer?: IClientMeta;
  pendingMethod?: PendingMethod;
  status: ConnectionStatus;
  walletId?: WalletId;
}

export interface WCSState {
  connection: ConnectionState;
  modal: ModalState;
  wallet: WalletState;
}

export interface WCSSetStateParam extends WCSState {
  connector?: WalletConnectClientType;
}

export type PartialState<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

export type WCSSetState = (
  state: PartialState<WCSState>,
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
  connectionDuration?: number;
  jwtDuration?: number;
  noPopup?: boolean;
  individualAddress?: string;
  groupAddress?: string;
  prohibitGroups?: boolean;
  walletId: WalletId;
  onDisconnect?: (message?: string) => void;
}
export type ConnectMethodFunction = ConnectMethod & {
  // These will always exist since they will show up with defaults
  bridge: string;
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean;
};

export interface ConnectMethodResults {
  state?: PartialState<WCSState>;
  error?: string;
  resetState?: boolean;
  connector?: WalletConnectClientType;
}

export interface WalletConnectInitMethod {
  bridge: string;
  connectionDuration: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration: number;
  prohibitGroups: boolean;
  walletId: WalletId;
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

export type UpdateModalData = Partial<ModalState> & { walletId?: WalletId };

export type WalletAction = 'switchToGroup' | 'removePendingMethod';
