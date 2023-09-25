import { WalletState } from 'types/Service';
import { BROWSER_EVENTS } from '../../../consts';
import { ProvenanceMethod } from '../../Cosmos';
import { BrowserWallet } from '../../Wallet';
import type { ResponseError } from './Generic';

/*  Full flow of communication:
  1) dApp => wcjs.method()  
  2) wcjs.method() => methodFunction()
  3) methodFunction() => wallet (walletconnect || browser message)
  4) wallet => methodFunction() (walletconnect || browser message)
  5) methodFunction() => wcjs.method()
  6) wcjs.method() => dApp
*/

// ----------------------------------
// CONNECT
// ----------------------------------

// Values passing into method when dApp calls service function
// 1) dApp => wcjs.method()
export interface ConnectMethodBrowser {
  connectionDuration?: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration?: number;
  onDisconnect?: (message?: string) => void;
  prohibitGroups?: boolean;
  wallet: BrowserWallet;
}
// Values passed into method when services calls function w/defaults (optional values now filled)
// 2) wcjs.method() => methodFunction()
export type ConnectMethodBrowserFunction = ConnectMethodBrowser & {
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean;
};
// Values sent from service to wallet (browser)
// methodFunction() => wallet
export interface ConnectRequestBrowser {
  browserEvent: typeof BROWSER_EVENTS[keyof typeof BROWSER_EVENTS];
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
// Values returned to service from wallet (browser)
// wallet => methodFunction()
export interface ConnectResponseBrowser {
  // request: ConnectRequestBrowser;
  // result: {
  chainId: string; // TODO: Get this type
  wallet: WalletState;
  error?: ResponseError;
  // };
}
// Values returned by service function
// methodFunction() => wcjs.method()
// Note: This is shared with wcConnect so it will live within ServiceMethods ConnectMethod
// export interface ConnectMethodResultsBrowser {
//   state?: PartialState<WCSState>;
//   error?: string;
//   resetState?: boolean;
//   connector?: WalletConnectClient;
// }
// Values returned to dApp by service
// wcjs.method() => dApp
export interface ConnectResultBrowser {
  result?: {
    connectionEST: number;
    connectionEXP: number;
    connectionType: 'existing session' | 'new session';
  };
  error?: ResponseError;
}
