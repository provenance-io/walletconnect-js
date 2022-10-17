import type { GasPrice } from './GasPriceType';
export declare type SendCoinData = {
    to: string;
    amount: number;
    denom: string;
    gasPrice?: GasPrice;
};
