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
  // TODO: We should still wait for a response to match the async of other messages, expect a simple "success"
  // Could potentially return "Failed, due to already being disconnected" or something like that
  wallet.browserEventAction(request, PROVENANCE_METHODS.DISCONNECT);
};
