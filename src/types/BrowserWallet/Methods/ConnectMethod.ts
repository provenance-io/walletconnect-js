import { WalletState } from 'types/Service';
import { BrowserWallet } from '../../Wallet';
import type { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

// Values passing into method when dApp calls service function
// 1) dApp => wcjs.method()
export type ConnectMethod = BaseBrowserRequest & {
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
export type ConnectFunction = ConnectMethod & {
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean; 
};
// Values sent from service to wallet (browser)
export interface ConnectMessageBrowser {
  request: ConnectRequestBrowser;
  sender: BrowserMessageSender;
}
// methodFunction() => wallet
export type ConnectRequestBrowser = BaseBrowserRequest & {
  connectionDuration: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration: number;
  prohibitGroups: boolean;
}
// Values returned to service from wallet (browser)
// wallet => methodFunction() 
export interface ConnectResponseBrowser {
  // request: ConnectRequestBrowser;
  result?: {
    chainId: string; // TODO: Get this type
    wallet: WalletState;
  };
  error?: MessageError;
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
