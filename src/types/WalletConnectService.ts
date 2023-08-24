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

type PendingMethod =
  | ''
  | 'sendMessage'
  | 'signJWT'
  | 'signHexMessage'
  | 'switchToGroup'
  | 'removePendingMethod';

export type ConnectionStatus = 'connected' | 'disconnected' | 'pending';

export interface ModalState {
  dynamicUrl: string;
  isMobile: boolean;
  QRCodeImg: string;
  QRCodeUrl: string;
  showModal: boolean;
}

export interface WalletState {
  address: string;
  attributes: AccountAttribute[];
  coin?: string;
  id?: number;
  name?: string;
  publicKey: string;
  representedGroupPolicy: MasterGroupPolicy | null;
  signedJWT: string;
}
export interface ConnectionState {
  bridge: string;
  connectionEST: number | null;
  connectionEXP: number | null;
  connectionTimeout: number;
  onDisconnect?: (message?: string) => void;
  peer: IClientMeta | null;
  status: ConnectionStatus;
  walletAppId?: WalletId;
}

export interface WCSStateNew {
  connection: ConnectionState;
  modal: ModalState;
  pendingMethod: PendingMethod;
  wallet: WalletState;
}

export interface WCSState {
  address: string; // Done
  attributes: AccountAttribute[]; // Done
  bridge: string; // Done
  connectionEST: number | null; // Done
  connectionEXP: number | null; // Done
  connectionTimeout: number; // Done
  modal: ModalState; // Done
  onDisconnect?: (message?: string) => void; // Done
  peer: IClientMeta | null; // Done
  pendingMethod: PendingMethod; // Done
  publicKey: string; // Done
  representedGroupPolicy: MasterGroupPolicy | null; // Done
  signedJWT: string; // Done
  status: ConnectionStatus; // Done
  version: string; // Won't Do
  walletAppId?: WalletId; // Done
  walletInfo: WalletInfo; // Done
}

export interface WCSSetStateParam extends WCSStateNew {
  connector?: WalletConnectClient;
}

export type WCSSetState = (
  state: Partial<WCSSetStateParam>,
  updateLocalStorage?: boolean
) => void;
export type WCSSetFullState = (state: WCSStateNew) => void;

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
  onDisconnect?: (message?: string) => void;
}

export interface ConnectMethodResults {
  state?: Partial<WCSStateNew>;
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
  state: WCSStateNew;
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
