import type { MarkerData, WCSState } from '../../types';
export declare const markerActivate: (state: WCSState, data: MarkerData) => Promise<{
    valid: boolean;
    result: any;
    data: MarkerData;
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
    data: MarkerData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
