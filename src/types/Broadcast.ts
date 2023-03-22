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
export interface ConnectMethodEventData extends BasicBroadcastEventData {
  result?: ConnectMethodResult;
}

export interface DisconnectMethodResult extends BasicBroadcastEventData {
  message?: string;
}
export interface DisconnectMethodEventData extends BasicBroadcastEventData {
  result?: DisconnectMethodResult;
}

export interface SendMessageMethodEventData extends BasicBroadcastEventData {
  result?: SendMessageMethodResult;
}
export interface SendMessageMethodResult {
  txResponse?: {
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

export interface SignJWTMethodEventData extends BasicBroadcastEventData {
  result?: SignJWTMethodResult;
}
export interface SignJWTMethodResult {
  signature: string;
  signedJWT: string;
  expires: number;
}

export interface SignHexMessageMethodEventData extends BasicBroadcastEventData {
  result?: SignHexMessageMethodResult;
}
export interface SignHexMessageMethodResult {
  signature: string;
}

export interface SwitchToGroupMethodEventData extends BasicBroadcastEventData {
  result?: string;
}

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
interface BasicBroadcastEventData {
  error?: string;
  valid?: boolean;
  request?: BroadcastRequest;
}

// All the possible BroadcastResults mapped
export interface BroadcastEventData {
  [WINDOW_MESSAGES.CONNECTED]: ConnectMethodEventData;
  [WINDOW_MESSAGES.SESSION_UPDATED]: ConnectMethodEventData;
  [WINDOW_MESSAGES.DISCONNECT]: DisconnectMethodEventData;
  [WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE]: SendMessageMethodEventData;
  [WINDOW_MESSAGES.SEND_MESSAGE_FAILED]: SendMessageMethodEventData;
  [WINDOW_MESSAGES.SIGN_HEX_MESSAGE_COMPLETE]: SignHexMessageMethodEventData;
  [WINDOW_MESSAGES.SIGN_HEX_MESSAGE_FAILED]: SignHexMessageMethodEventData;
  [WINDOW_MESSAGES.SIGN_JWT_COMPLETE]: SignJWTMethodEventData;
  [WINDOW_MESSAGES.SIGN_JWT_FAILED]: SignJWTMethodEventData;
  [WINDOW_MESSAGES.SWITCH_TO_GROUP_COMPLETE]: SwitchToGroupMethodEventData;
  [WINDOW_MESSAGES.SWITCH_TO_GROUP_FAILED]: SwitchToGroupMethodEventData;
}
