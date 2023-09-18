// Flow: dApp => WalletConnectService[method] => methodFunction => WalletConnectService[method] => dApp

import {
  ConnectWalletRequestBrowser,
  ConnectWalletResponseBrowser,
} from './ConnectMethod';

export interface BasicServiceResponse {
  error?: { message: string; code: number };
  // result: Each method needs to describe its own result (will always exist, but unique type)
}

// All possible requests sent to the wallet from service
// TODO: Will have all methods once complete
export type BrowserWalletRequest = ConnectWalletRequestBrowser;

// All possible responses sent to service from wallet
// TODO: Will have all methods once complete
export type BrowserWalletResponse = ConnectWalletResponseBrowser;
