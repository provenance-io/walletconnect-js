import { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

export interface DisconnectMessageBrowser {
  request: DisconnectRequestBrowser;
  sender: BrowserMessageSender;
}

export type DisconnectRequestBrowser = BaseBrowserRequest & {
  message?: string;
};

export type DisconnectResultBrowser = {
  result?: { success: boolean; };
  error?: MessageError;
}