import type { GasPrice } from './GasPriceType';
import { WalletConnectClientType } from './WalletConnectService';
import { ConnectData } from './ConnectData';

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
      connector: WalletConnectClientType;
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

export interface BroadcastResult {
  data?:
    | MethodSendMessageData
    | MethodConnectData
    | MethodSignJWTData
    | number
    | string;
  error?: string;
  request?: MethodRequest;
  // result comes from walletconnect, can't change the "any" type
  result?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  valid?: boolean;
}

export type Broadcast = (eventName: string, data?: BroadcastResult) => void;
