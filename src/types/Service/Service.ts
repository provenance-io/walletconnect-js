import type WalletConnectClient from '@walletconnect/client';
import { MasterGroupPolicy } from '../MasterGroupPolicy';
import type { AccountAttribute, AccountObject, WalletId } from '../Wallet';

type PendingMethod =
  | ''
  | 'sendTx'
  | 'signJWT'
  | 'sign'
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
  jwt?: string;
}
export interface ConnectionState {
  bridge?: string;
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
  connector?: WalletConnectClient;
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

export type UpdateModalData = Partial<ModalState> & { walletId?: WalletId };
