import type { MarkerAddData, WCSState } from '../../types';
export declare const markerAdd: (state: WCSState, data: MarkerAddData) => Promise<{
    valid: boolean;
    result: any;
    data: MarkerAddData;
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
    data: MarkerAddData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
