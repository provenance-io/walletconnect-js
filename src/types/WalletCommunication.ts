import type WalletConnectClient from '@walletconnect/client';
import { BROWSER_EVENTS } from '../consts';
import type { ProvenanceMethod } from './Cosmos';
import { WalletId } from './Wallet';

export type BrowserEventKey = keyof typeof BROWSER_EVENTS;
export type BrowserEventValue = typeof BROWSER_EVENTS[BrowserEventKey];

export interface SendWalletMessage {
  walletId: WalletId;
  // request: WalletMessageRequest;
  request: any; // TODO: Don't use any
  connector?: WalletConnectClient;
}

// disconnect, sendMessage, signMessage, signJWT, etc
interface SendMessageRequestGeneric {
  id?: number; // Wallets use ID to track a request
  browserEvent?: BrowserEventValue; // Only exists when communicating with browser type wallet
  jsonrpc?: string; // Used by wallets when broadcasting to chain
  method?: ProvenanceMethod; // Used by wallets to build the blockchain message
  params?: string[]; // Array holding single string value of "metadata"
}
// connect
interface SendMessageRequestConnect {
  individualAddress?: string; // Required individual account for connection
  groupAddress?: string; // Required group account for connection
  connectionDuration?: number; // How long should the dApp and wallet remain connected
  jwtDuration?: number; // How long should the signed JWT live for
  prohibitGroups?: boolean; // Are groups allowed in this connection
  requestFavicon?: string[]; // dApp favicon
  requestOrigin?: string; // dApp URL
  requestName?: string; // dApp page title/name
}
// Request data sent to browser/wc wallets when a wcjs method is called
export type SendMessageRequest = SendMessageRequestGeneric &
  SendMessageRequestConnect;
