import type { SendCoinData, WCSState } from '../../types';
export declare const sendCoin: (state: WCSState, data: SendCoinData) => Promise<{
    valid: boolean;
    result: any;
    data: SendCoinData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    error?: undefined;
} | {
    valid: boolean;
    error: unknown;
    data: SendCoinData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
