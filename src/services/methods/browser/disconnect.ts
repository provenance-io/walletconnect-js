import { DisconnectRequestBrowser } from 'types/BrowserWallet/Methods/DisconnectMethod';
import { getPageData, rngNum } from 'utils';
import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet } from '../../../types';

export const disconnect = async (message: string, wallet: BrowserWallet, description = 'Disconnect Event') => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  
  // Build out full request object to send to browser wallet
  const request: DisconnectRequestBrowser = {
    message,
    browserEvent: BROWSER_EVENTS.DISCONNECT,
    date: Date.now(),
    description,
    id: `${rngNum()}`,
    method: PROVENANCE_METHODS.DISCONNECT,
    requestFavicon,
    requestName,
    requestOrigin,
  };
  // Note: We don't need to wait for a response, this will just disconnect as expected
  // TODO: We should still wait for a response to match the async of other messages, expect a simple "success"
  // Could potentially return "Failed, due to already being disconnected" or something like that
  const { error, result } = await wallet.browserEventAction(request, PROVENANCE_METHODS.DISCONNECT);
  
  if (error) return { error };
  if (!result) return { error: { message: 'Result missing', code: 0}};
  
  return result;
};
