import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../consts';
import { TxResponse } from './Cosmos';
import { WalletId } from './Wallet';

export type BrowserEventKey = keyof typeof BROWSER_EVENTS;
export type BrowserEventValue = typeof BROWSER_EVENTS[BrowserEventKey];
export type ProvenanceMethod =
  typeof PROVENANCE_METHODS[keyof typeof PROVENANCE_METHODS];

// TODO: Don't have any "any"'s
export type WalletEventData = any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Request data sent to all wallet types when a wcjs method is called
export interface WalletMessageRequest {
  id?: number;
  jsonrpc?: string;
  method?: ProvenanceMethod;
  params?: string[];
  individualAddress?: string;
  groupAddress?: string;
  connectionDuration?: number;
  jwtDuration?: number;
  prohibitGroups?: boolean;
  requestFavicon?: string[];
  requestOrigin?: string;
  requestName?: string;
}

// Data sent to Browser wallets through a window message
export interface BrowserEventData {
  walletId?: WalletId;
  browserEvent?: BrowserEventValue;
  uri?: string;
  address?: string;
  duration?: number;
  data?: WalletEventData;
  referral?: string;
  redirectUrl?: string;
  request?: WalletMessageRequest;
}

interface WalletMessageBasicResponse {
  error?: string;
  valid?: boolean;
  request?: WalletMessageRequest;
}

// CONNECT METHOD
interface ConnectResponse extends WalletMessageBasicResponse {
  result?: {
    connectionEST: number;
    connectionEXP: number;
    connectionType: 'existing session' | 'new session';
  };
}
// DISCONNECT METHOD
interface DisconnectResponse extends WalletMessageBasicResponse {
  result?: { message: string };
}
// SEND MESSAGE METHOD
interface SendMessageResponse extends WalletMessageBasicResponse {
  result?: TxResponse;
}
// SIGN MESSAGE METHOD
interface SignMessageResponse extends WalletMessageBasicResponse {
  result?: { signature: string };
}
// SIGN JWT METHOD
interface SignJWTResponse extends WalletMessageBasicResponse {
  result?: { signature: string; signedJWT: string; expires: number };
}
// SWITCH TO GROUP METHOD
interface SwitchGroupResponse extends WalletMessageBasicResponse {
  result?: string;
}
// REMOVE PENDING METHOD
interface RemovePendingMethodResponse extends WalletMessageBasicResponse {
  result?: string;
}

export type WalletMessageResponse =
  | ConnectResponse
  | DisconnectResponse
  | SendMessageResponse
  | SignMessageResponse
  | SignJWTResponse
  | SwitchGroupResponse
  | RemovePendingMethodResponse;
