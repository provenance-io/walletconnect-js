import type { DelegateHashData, WCSState } from '../../types';
export declare const delegateHash: (state: WCSState, data: DelegateHashData) => Promise<{
    valid: boolean;
    data: DelegateHashData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    error: string;
    result?: undefined;
} | {
    valid: boolean;
    result: any;
    data: {
        sentAmount: {
            denom: string;
            amount: number;
        };
        validatorAddress: string;
        to: never;
        amount: number;
        gasPrice?: import("../../types").GasPrice | undefined;
    };
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
    data: {
        sentAmount: {
            denom: string;
            amount: number;
        };
        validatorAddress: string;
        to: never;
        amount: number;
        gasPrice?: import("../../types").GasPrice | undefined;
    };
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
