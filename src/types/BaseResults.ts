import { MarkerData } from './MarkerData';
import { MarkerAddData } from './MarkerAddData';
import { CustomActionData } from './CustomActionData';
import { SendCoinData } from './SendCoinData';
import { SendHashData } from './SendHashData';

export type BaseResults = {
  valid: boolean
  result?: Record<string, unknown>
  data: MarkerData | MarkerAddData | CustomActionData | SendCoinData | SendHashData | string
  error?: string | Error | unknown
  request?: {
    id: number
    jsonrpc: string
    method: string
    params: string[],
  },
};
