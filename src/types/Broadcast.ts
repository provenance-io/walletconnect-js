import type { GasPrice } from './GasPriceType';
import { WCSState } from './WalletConnectService';
import { ConnectData } from './ConnectData';
import { WINDOW_MESSAGES } from '../consts';

export type ProvenanceMethod = 'provenance_sign' | 'provenance_sendTransaction';

export interface MethodSendMessageData {
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

export type ConnectionType = 'existing session' | 'new session';

export type MethodConnectData =
  | {
      connectionEST: number;
      connectionEXP: number;
      connectionType: ConnectionType;
    }
  | ConnectData;

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

type BroadcastResultData =
  | MethodSendMessageData
  | MethodConnectData
  | MethodSignJWTData
  | number
  | string;

// type SignHexMessageWCResult = string
// type SendMessageWCResult = string
// // "8deff4b1fd5a32c7ccbbaca25476b212a42efa1e97fb5dd097aa35b5cb84429b1baab1c20096d93e10681f5a4b8873a8829785ef4088696a8c7c00e179a5e29c"
// type SignJWTWCResult = string;
// type ConnectWCResult = string
// type DisconnectWCResult = string

// type BroadcastWalletConnectResult =
//   | SignHexMessageWCResult
//   | SendMessageWCResult
//   | SignJWTWCResult
//   | ConnectWCResult
//   | DisconnectWCResult;

export interface BroadcastResult {
  data?: BroadcastResultData;
  error?: string;
  request?: MethodRequest;
  // result comes from walletconnect, can't change the "any" type
  result?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  valid?: boolean;
}

export type Broadcast = (eventName: BroadcastEvent, data?: BroadcastResult) => void;

export interface ConnectorEventData {
  broadcastData?: {
    eventName: BroadcastEvent;
    payload?: BroadcastResult;
  };
  stateData?: 'reset' | Partial<WCSState>;
}
