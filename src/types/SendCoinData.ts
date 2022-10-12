import type { GasPrice } from './GasPriceType';

export type SendCoinData = {
  to: string;
  amount: number;
  denom: string;
  gasPrice?: GasPrice;
};
