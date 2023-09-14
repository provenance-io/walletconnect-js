import { AccountObject } from './Wallet';

export type WalletConnectAccountInfo = string[] | AccountObject[] | undefined;

export interface WalletConnectEventDisconnect {
  event: string;
  params: { message?: string }[];
}

interface ConnectResponse {
  result?: string;
  error?: string;
  request?: string;
}

export interface WalletConnectResponse {
  connect: ConnectResponse;
  disconnect: string;
}
