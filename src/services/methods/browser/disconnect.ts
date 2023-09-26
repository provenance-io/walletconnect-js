import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet } from '../../../types';

export const disconnect = (message: string, wallet: BrowserWallet) => {
  // Build out full request object to send to browser wallet
  const request = {
    method: PROVENANCE_METHODS.DISCONNECT,
    browserEvent: BROWSER_EVENTS.DISCONNECT,
    message,
  };
  // Note: We don't need to wait for a response, this will just disconnect as expected
  wallet.browserEventAction(request, PROVENANCE_METHODS.DISCONNECT);
};
