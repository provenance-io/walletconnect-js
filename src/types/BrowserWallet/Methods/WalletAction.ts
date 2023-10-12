import { WALLET_ACTIONS } from 'consts';
import { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

export type WalletAction = typeof WALLET_ACTIONS[keyof typeof WALLET_ACTIONS];

export interface WalletActionMessageBrowser {
  request: WalletActionRequestBrowser;
  sender: BrowserMessageSender;
}

export type WalletActionRequestBrowser = BaseBrowserRequest & {
  action: WalletAction;
};

export interface WalletActionResponseBrowser {
  result?: {
    // TODO: get the proper result based on the walletAction name
  };
  error?: MessageError;
}

// export interface WalletActionMethod {
//   method?: ProvenanceMethod;
//   description?: string;
//   action: WalletAction;
//   payload?: Record<string, unknown>;
// }
