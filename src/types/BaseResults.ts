import { MarkerData } from './MarkerData';
import { MarkerAddData } from './MarkerAddData';
import { CustomActionData } from './CustomActionData';
import { SendCoinData } from './SendCoinData';
import { SignJWTData } from './SignJWTData';
import { SendHashData } from './SendHashData';

export type BaseResults = {
  valid: boolean
  result?: Record<string, unknown>
  data: MarkerData | MarkerAddData | CustomActionData | SendCoinData | SignJWTData | SendHashData
  error?: string | Error | unknown
  request?: {
    id: number
    jsonrpc: string
    method: string
    params: [
      metadata: string,
      hexMsg: string
    ],
  },
};
