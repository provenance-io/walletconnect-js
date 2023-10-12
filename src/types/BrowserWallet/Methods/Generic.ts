// Flow: dApp => WalletConnectService[method] => methodFunction => WalletConnectService[method] => dApp

import { BROWSER_EVENTS, BROWSER_MESSAGE_SENDERS, PROVENANCE_METHODS } from 'consts';
import { ProvenanceMethod } from '../../Cosmos';
import { ConnectMessageBrowser, ConnectRequestBrowser, ConnectResponseBrowser } from './ConnectMethod';
import { DisconnectMessageBrowser, DisconnectRequestBrowser, DisconnectResultBrowser } from './DisconnectMethod';
import { ResumeMessageBrowser, ResumeRequestBrowser, ResumeResponseBrowser } from './ResumeMethod';
import { SendTxMessageBrowser, SendTxRequestBrowser, SendTxResponseBrowser } from './SendTx';

export interface MessageError {
  error?: { message: string; code: number };
  // result: Each method needs to describe its own result (will always exist, but unique type)
}

export type BrowserMessageSender = typeof BROWSER_MESSAGE_SENDERS[keyof typeof BROWSER_MESSAGE_SENDERS];

export interface BaseBrowserRequest {
  browserEvent: typeof BROWSER_EVENTS[keyof typeof BROWSER_EVENTS];
  date: number;
  description: string;
  id: string;
  method: ProvenanceMethod;
  requestFavicon?: string[];
  requestName?: string;
  requestOrigin?: string;
}

// All possible messages sent to the wallet from service
// Note: Message include request and sender
export interface BrowserWalletEventActionMessages {
  [PROVENANCE_METHODS.CONNECT]: ConnectMessageBrowser;
  [PROVENANCE_METHODS.RESUME]: ResumeMessageBrowser;
  [PROVENANCE_METHODS.DISCONNECT]: DisconnectMessageBrowser;
  [PROVENANCE_METHODS.SEND]: SendTxMessageBrowser;
  [PROVENANCE_METHODS.SIGN]: any; // TODO: Build out type
  [PROVENANCE_METHODS.ACTION]: any; // TODO: Build out type
}

// All possible requests sent to the wallet from service
// Note: Requests don't include sender
export interface BrowserWalletEventActionRequests {
  [PROVENANCE_METHODS.CONNECT]: ConnectRequestBrowser;
  [PROVENANCE_METHODS.RESUME]: ResumeRequestBrowser;
  [PROVENANCE_METHODS.DISCONNECT]: DisconnectRequestBrowser;
  [PROVENANCE_METHODS.SEND]: SendTxRequestBrowser;
  [PROVENANCE_METHODS.SIGN]: any; // TODO: Build out type
  [PROVENANCE_METHODS.ACTION]: any; // TODO: Build out type
}

// All possible responses sent to service from wallet
// Note: Response includes result and error
export interface BrowserWalletEventActionResponses {
  [PROVENANCE_METHODS.CONNECT]: ConnectResponseBrowser;
  [PROVENANCE_METHODS.RESUME]: ResumeResponseBrowser;
  [PROVENANCE_METHODS.DISCONNECT]: DisconnectResultBrowser;
  [PROVENANCE_METHODS.SEND]: SendTxResponseBrowser;
  [PROVENANCE_METHODS.SIGN]: any; // TODO: Build out type
  [PROVENANCE_METHODS.ACTION]: any; // TODO: Build out type
}
