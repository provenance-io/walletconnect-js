import type { MarkerData } from './MarkerData';
import type { MarkerAddData } from './MarkerAddData';
import type { CustomActionData } from './CustomActionData';
import type { SendCoinData } from './SendCoinData';
import type { DelegateHashData } from './DelegateHash';
export declare type BaseResults = {
    valid: boolean;
    result?: Record<string, unknown>;
    data: MarkerData | MarkerAddData | CustomActionData | SendCoinData | DelegateHashData | string | number;
    error?: string | Error | unknown;
    request?: {
        id: number;
        jsonrpc: string;
        method: string;
        params: string[];
    };
    signedJWT?: string;
};
