import { SendMessageMethod, SendWalletActionMethod } from './WalletConnectService';
import { ConnectData } from './ConnectData';
import { WINDOW_MESSAGES } from '../consts';

export type ProvenanceMethod =
  | 'provenance_sign'
  | 'provenance_sendTransaction'
  | 'wallet_action';

export type ConnectionType = 'existing session' | 'new session';

interface BasicConnectData {
  connectionEST: number;
  connectionEXP: number;
  connectionType: ConnectionType;
}

export type MethodConnectData = BasicConnectData | ConnectData;

export interface MethodSignJWTData {
  signedJWT?: string;
  expires: number;
}

interface MetaData {
  description: string;
  address: string;
  date: number;
}

interface MethodRequest {
  id: number;
  jsonrpc: string;
  method: ProvenanceMethod;
  params: MetaData[] | string[];
}

type BroadcastEventKeys = keyof typeof WINDOW_MESSAGES;
export type BroadcastEvent = typeof WINDOW_MESSAGES[BroadcastEventKeys];

interface MethodDisconnectData {
  message?: string;
}

type BroadcastResultData =
  | SendMessageMethod
  | SendWalletActionMethod
  | MethodConnectData
  | MethodDisconnectData
  | MethodSignJWTData
  | number
  | string;

interface TxEvent {
  type: string;
  attributesList: {
    key: string;
    value: string;
    index?: boolean;
  }[];
}
interface TxLog {
  msgIndex: number;
  log: string;
  eventsList: {
    type: string;
    attributesList: TxEvent[];
  }[];
}
interface TxResponse {
  code: number;
  codespace: string;
  data: string;
  eventsList: TxEvent[];
  gasUsed: number;
  gasWanted: number;
  height: number;
  info: string;
  logsList: TxLog[];
  rawLog: string;
  timestamp: string;
  txhash: string;
}

export interface SendMessageResult {
  txResponse: TxResponse;
}

type BroadcastWCResult = SendMessageResult | BasicConnectData | string;

export interface BroadcastResult {
  data?: BroadcastResultData;
  error?: string;
  request?: MethodRequest;
  result?: BroadcastWCResult;
  valid?: boolean;
}

export type Broadcast = (eventName: BroadcastEvent, data?: BroadcastResult) => void;

export interface WCDisconnectEvent {
  event: string;
  params: { message?: string }[];
}
