import { WALLET_ACTIONS } from '../consts';
import { GasPrice, ProvenanceMethod } from './Cosmos';
import { WalletId } from './Wallet';
import { WalletConnectClientType } from './WalletConnect';
import { PartialState, WCSState } from './WalletConnectService';

// Flow: dApp => WalletConnectService[method] => methodFunction => WalletConnectService[method] => dApp

// ----------------------------------
// CONNECT
// ----------------------------------
// Values passing into method when dApp calls service function
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
// Values passed into method when services calls function w/defaults
export type ConnectMethodFunction = ConnectMethod & {
  bridge: string;
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean;
};
// Values returned by service function
export interface ConnectMethodResults {
  state?: PartialState<WCSState>;
  error?: string;
  resetState?: boolean;
  connector?: WalletConnectClientType;
}
// Values returned to dApp by service
export interface ConnectResponse extends WalletMessageBasicResponse {
  result?: {
    connectionEST: number;
    connectionEXP: number;
    connectionType: 'existing session' | 'new session';
  };
}
// ----------------------------------
// SEND_MESSAGE
// ----------------------------------
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
// ----------------------------------
// WALLET_ACTION
// ----------------------------------
export type WalletAction = typeof WALLET_ACTIONS[keyof typeof WALLET_ACTIONS];
export interface WalletActionMethod {
  method?: ProvenanceMethod;
  description?: string;
  action: WalletAction;
  payload?: Record<string, unknown>;
}
