import { GasPrice, ProvenanceMethod } from '../../Cosmos';
import { BrowserWallet } from '../../Wallet';
import { BrowserEventValue } from '../../WalletCommunication';
import { ResponseError } from './Generic';

// Data passed into the function
export interface BrowserSendTx {
  address: string;
  customId?: string;
  description?: string;
  extensionOptions?: string[];
  feeGranter?: string;
  feePayer?: string;
  gasPrice?: GasPrice;
  memo?: string;
  tx: string | string[];
  nonCriticalExtensionOptions?: string[];
  timeoutHeight?: number;
  wallet: BrowserWallet;
}

// Data sent to the wallet
export type BrowserSendTxRequest = Omit<BrowserSendTx, 'wallet'> & {
  browserEvent: BrowserEventValue;
  description: string;
  date: number;
  id: string;
  method: ProvenanceMethod;
  requestFavicon: string[];
  requestName: string;
  requestOrigin: string;
};

// Response from the wallet
export interface BrowserSendTxReturn {
  valid: boolean;
  error?: ResponseError;
  request?: BrowserSendTxRequest;
  result?: any; // TODO: Get exact result
}
