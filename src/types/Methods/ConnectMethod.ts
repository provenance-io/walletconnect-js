import type WalletConnectClient from '@walletconnect/client';
import { ProvenanceMethod } from '../Cosmos';
import type { AccountObject, WalletId } from '../Wallet';
import type { PartialState, WCSState } from '../WalletConnectService';
import type { BasicServiceResponse } from './Generic';

/*  Full flow of communication:
  1) dApp => wcjs.method()  
  2) wcjs.method() => methodFunction()
  3) methodFunction() => wallet
  4) wallet => methodFunction()
  5) methodFunction() => wcjs.method()
  6) wcjs.method() => dApp
*/

// ----------------------------------
// CONNECT
// ----------------------------------
interface ConnectRequest {
  browserEvent: string; // TODO: Get this type
  connectionDuration: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration: number;
  method: ProvenanceMethod; // TODO: Get this type
  prohibitGroups: boolean;
  requestFavicon?: string[];
  requestName?: string;
  requestOrigin?: string;
}

// Values passing into method when dApp calls service function
// dApp => wcjs.method()
export interface ConnectMethod {
  bridge?: string;
  connectionDuration?: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration?: number;
  noPopup?: boolean;
  onDisconnect?: (message?: string) => void;
  prohibitGroups?: boolean;
  walletId: WalletId;
}
// Values passed into method when services calls function w/defaults (optional values now filled)
// wcjs.method() => methodFunction()
export type ConnectMethodFunction = ConnectMethod & {
  bridge: string;
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean;
};
// Values sent from service to wallet (browser)
// methodFunction() => wallet
export interface ConnectWalletRequestBrowser {
  request: ConnectRequest;
  walletId: WalletId;
}
// Values returned to service from wallet (browser)
// wallet => methodFunction()
export interface ConnectWalletResponseBrowser {
  request: ConnectRequest;
  result: {
    chainId: string; // TODO: Get this type
    accounts: AccountObject;
  };
  error?: BasicServiceResponse;
}
// Values returned to service from wallet (walletconnect)
// wallet => methodFunction()
// TODO: Verify this type with mobile wallet
export interface ConnectWalletResponseWC {
  chainId: string; // TODO: Get this type
  accounts: AccountObject;
}
// Values returned by service function
// methodFunction() => wcjs.method()
export interface ConnectMethodResults {
  state?: PartialState<WCSState>;
  error?: string;
  resetState?: boolean;
  connector?: WalletConnectClient;
}
// Values returned to dApp by service
// wcjs.method() => dApp
export interface ConnectResponse extends BasicServiceResponse {
  result?: {
    connectionEST: number;
    connectionEXP: number;
    connectionType: 'existing session' | 'new session';
  };
}
