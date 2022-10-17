import { CustomActionData } from '../../types';
import type { WCSState } from '../../types';
export declare const customAction: (state: WCSState, data: CustomActionData) => Promise<{
    valid: boolean;
    result: any;
    data: CustomActionData;
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
    data: CustomActionData;
    request: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    result?: undefined;
}>;
