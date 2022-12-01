import type { GasPrice } from './GasPriceType';

export type SendMessageData = {
  message: string | string[];
  description?: string;
  method?: string;
  gasPrice?: GasPrice;
  feePayer?: string;
};
