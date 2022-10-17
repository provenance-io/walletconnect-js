import type { WCSState } from '../../types';
export declare const signMessage: (state: WCSState, message: string) => Promise<{
    valid: boolean;
    result: any;
    data: string;
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
    data: string;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
