import { BROWSER_EVENTS } from '../../../consts';
import { ProvenanceMethod } from '../../Cosmos';
import { WalletState } from '../../Service';
import { ResponseError } from './Generic';

export interface ResumeRequestBrowser {
  browserEvent: typeof BROWSER_EVENTS[keyof typeof BROWSER_EVENTS];
  method: ProvenanceMethod;
  requestFavicon?: string[];
  requestName?: string;
  requestOrigin?: string;
}
// Values returned to service from wallet (browser)
// wallet => methodFunction()
export interface ResumeResponseBrowser {
  // request: ConnectRequestBrowser;
  // result: {
  wallet: WalletState;
  est: number;
  exp: number;
  error?: ResponseError;
  // };
}
