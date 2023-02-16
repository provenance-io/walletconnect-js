import WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type { AccountObject, MasterGroupPolicy, WalletInfo } from './ConnectData';
import type { ProvenanceMethod } from './Broadcast';
import type { GasPrice } from './GasPriceType';

export type WalletConnectClientType = WalletConnectClient;

type WCSPendingMethod = '' | 'sendMessage' | 'signJWT' | 'signHexMessage' | 'switchToGroup';

export type WalletConnectServiceStatus = 'connected' | 'disconnected' | 'pending';

export type WalletAction = 'switchToGroup';

export interface ModalData {
  QRCodeImg: string;
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

export interface ConnectMethod {
  bridge?: string;
  duration?: number;
  noPopup?: boolean;
  address?: string;
  prohibitGroups?: boolean;
  jwtExpiration?: number;
}

export interface SendMessageMethod {
  message: string | string[];
  description?: string;
  method?: ProvenanceMethod;
  gasPrice?: GasPrice;
  feeGranter?: string;
  feePayer?: string;
  memo?: string;
  timeoutHeight?: number;
  extensionOptions?: string[];
  nonCriticalExtensionOptions?: string[];
}

export interface SendWalletActionMethod {
  method?: ProvenanceMethod;
  description?: string;
  action: WalletAction;
  payload: Record<string, unknown>;
}
