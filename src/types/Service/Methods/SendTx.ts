import { GasPrice } from '../../Cosmos';

export interface ServiceSendTx {
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
}
