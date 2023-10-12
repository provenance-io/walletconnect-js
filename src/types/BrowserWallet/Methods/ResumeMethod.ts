import { BaseBrowserRequest, BrowserMessageSender, MessageError } from './Generic';

export interface ResumeMessageBrowser {
  request: ResumeRequestBrowser;
  sender: BrowserMessageSender;
}

export type ResumeRequestBrowser = BaseBrowserRequest;
// Values returned to service from wallet (browser)
// wallet => methodFunction()
export interface ResumeResponseBrowser {
  result?: {
    est: number;
    exp: number;
  }
  error?: MessageError;
}
