import type { GasPrice } from './GasPriceType';
interface Amount {
    amount: number;
    gasPrice?: GasPrice;
}
export interface DelegateHashData extends Amount {
    validatorAddress: string;
    to: never;
}
export {};
