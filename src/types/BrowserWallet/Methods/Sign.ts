import { ProvenanceMethod } from '../../Cosmos';
import { BrowserWallet } from '../../Wallet';
import { BrowserEventValue } from '../../WalletCommunication';
import { ResponseError } from './Generic';

// Data passed into the function
export interface BrowserSign {
  address: string;
  description?: string;
  customId?: string;
  message: string;
  isHex?: boolean;
  publicKey: string;
  wallet: BrowserWallet;
}

// Data sent to the wallet
export type BrowserSignRequest = Omit<BrowserSign, 'wallet' | 'publicKey'> & {
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
export interface BrowserSignReturn {
  valid: boolean;
  error?: ResponseError;
  request?: BrowserSignRequest;
  result?: any; // TODO: Get exact result
}
