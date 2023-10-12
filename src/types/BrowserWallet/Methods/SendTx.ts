import { GasPrice, TxResponse } from '../../Cosmos';
import { BrowserWallet } from '../../Wallet';
import { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

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

export interface SendTxMessageBrowser {
  request: SendTxRequestBrowser;
  sender: BrowserMessageSender;
}

// Data sent to the wallet
export type SendTxRequestBrowser = BaseBrowserRequest & {
  address: string;
  feeGranter?: string;
  feePayer?: string;
  gasPrice?: GasPrice;
  memo?: string;
  tx: string | string[];
  timeoutHeight?: number;
};

// Response from the wallet
export interface SendTxResponseBrowser {
  error?: MessageError;
  result?: {
    txResponse: TxResponse;
  }
}
