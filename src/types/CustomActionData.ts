import type { GasPrice } from './GasPriceType';

export type CustomActionData = {
  message: string | string[];
  description?: string;
  method?: string;
  gasPrice?: GasPrice;
};
