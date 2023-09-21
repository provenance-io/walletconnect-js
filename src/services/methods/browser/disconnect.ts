import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet } from '../../../types';

export const disconnect = async (
  message: string,
  wallet: BrowserWallet
): Promise<any> => {
  // Build out full request object to send to browser wallet
  const request = {
    method: PROVENANCE_METHODS.DISCONNECT,
    browserEvent: BROWSER_EVENTS.BASIC,
    message,
  };
  // Wait for wallet to send back a response
  const response = await wallet.browserEventAction(
    request,
    PROVENANCE_METHODS.DISCONNECT
  );
  console.log('wcjs | disconnect.ts | disconnectResponse: ', response);

  return 'done';
};
