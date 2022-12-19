import type { GasPrice } from './GasPriceType';

export type SendMessageData = {
  message: string | string[];
  description?: string;
  method?: string;
  gasPrice?: GasPrice;
  feeGranter?: string;
  feePayer?: string;
  memo?: string;
  timeoutHeight?: number;
  extensionOptions?: string[];
  nonCriticalExtensionOptions?: string[];
};
