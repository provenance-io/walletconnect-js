import { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

export type SignMessageBrowser = {
  request: SignRequestBrowser;
  sender: BrowserMessageSender;
}

// Data sent to the wallet
export type SignRequestBrowser = BaseBrowserRequest & {
  address: string;
  message: string;
};
// Response from the wallet
export interface SignResponseBrowser {
  error?: MessageError;
  result?: {
    signature: string;
    valid: boolean;
  };
}
