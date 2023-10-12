import { BrowserWallet } from '../../Wallet';

// Data passed into the function
export interface BrowserSignFunction {
  address: string;
  description?: string;
  customId?: string;
  message: string;
  isHex?: boolean;
  publicKey: string;
  wallet: BrowserWallet;
}