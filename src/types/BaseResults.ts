import type { SendMessageData } from './SendMessageData';

export type BaseResults = {
  valid: boolean;
  result?: Record<string, unknown>;
  data: SendMessageData | string | number;
  error?: string | Error | unknown;
  request?: {
    id: number;
    jsonrpc: string;
    method: string;
    params: string[];
  };
  signedJWT?: string;
};
