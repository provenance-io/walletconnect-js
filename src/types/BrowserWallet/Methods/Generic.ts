// Flow: dApp => WalletConnectService[method] => methodFunction => WalletConnectService[method] => dApp

import { PROVENANCE_METHODS } from 'consts';
import { ConnectRequestBrowser, ConnectResponseBrowser } from './ConnectMethod';

export interface ResponseError {
  error?: { message: string; code: number };
  // result: Each method needs to describe its own result (will always exist, but unique type)
}

// All possible requests sent to the wallet from service
export type BrowserWalletEventActionRequests = {
  [PROVENANCE_METHODS.CONNECT]: ConnectRequestBrowser;
  [PROVENANCE_METHODS.DISCONNECT]: any; // TODO: Build out type
  [PROVENANCE_METHODS.SEND]: any; // TODO: Build out type
  [PROVENANCE_METHODS.SIGN]: any; // TODO: Build out type
  [PROVENANCE_METHODS.ACTION]: any; // TODO: Build out type
};

// All possible responses sent to service from wallet
export type BrowserWalletEventActionResponses = {
  [PROVENANCE_METHODS.CONNECT]: ConnectResponseBrowser;
  [PROVENANCE_METHODS.DISCONNECT]: any; // TODO: Build out type
  [PROVENANCE_METHODS.SEND]: any; // TODO: Build out type
  [PROVENANCE_METHODS.SIGN]: any; // TODO: Build out type
  [PROVENANCE_METHODS.ACTION]: any; // TODO: Build out type
};
