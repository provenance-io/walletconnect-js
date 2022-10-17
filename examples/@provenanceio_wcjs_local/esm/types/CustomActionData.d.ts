import type { GasPrice } from './GasPriceType';
export declare type CustomActionData = {
    message: string | string[];
    description?: string;
    method?: string;
    gasPrice?: GasPrice;
};
