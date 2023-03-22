import { WINDOW_MESSAGES } from '../consts';

export interface WalletConnectEventDisconnect {
  event: string;
  params: { message?: string }[];
}

type BroadcastEventNameKeys = keyof typeof WINDOW_MESSAGES;
export type BroadcastEventName = typeof WINDOW_MESSAGES[BroadcastEventNameKeys];

// All the different walletConnectService method results
export type ConnectionType = 'existing session' | 'new session';
export interface ConnectMethodResult {
  connectionEST: number;
  connectionEXP: number;
  connectionType: ConnectionType;
}

export interface DisconnectMethodResult {
  message?: string;
}

export interface SendMessageMethodResult {
  txResponse: {
    code: number;
    codespace: string;
    data: string;
    eventsList: {
      type: string;
      attributesList: {
        key: string;
        value: string;
        index?: boolean;
      }[];
    }[];
    gasUsed: number;
    gasWanted: number;
    height: number;
    info: string;
    logsList: {
      msgIndex: number;
      log: string;
      eventsList: {
        type: string;
        attributesList: {
          type: string;
          attributesList: {
            key: string;
            value: string;
            index?: boolean;
          }[];
        }[];
      }[];
    };
    rawLog: string;
    timestamp: string;
    txhash: string;
  };
}

export interface SignJWTMethodResult {
  signature: string;
  signedJWT: string;
  expires: number;
}

export interface SignHexMessageMethodResult {
  signature: string;
}

// Possible result values when a method is completed through walletconnect-js
type BroadcastResult =
  | SendMessageMethodResult
  | ConnectMethodResult
  | SignJWTMethodResult
  | SignHexMessageMethodResult
  | DisconnectMethodResult;

// Request data passed into the walletconnect sendCustomRequest function
export type ProvenanceMethod =
  | 'provenance_sign'
  | 'provenance_sendTransaction'
  | 'wallet_action';

interface BroadcastRequest {
  id: number;
  jsonrpc: string;
  method: ProvenanceMethod;
  params: string[]; // Note the first item in the params array is stringified metadata
}

// Broadcast Event Data - What a dApp gets back after calling a method or getting an action result from a listner
export interface BroadcastEventData {
  error?: string;
  request?: BroadcastRequest;
  result?: BroadcastResult;
  valid?: boolean;
}
