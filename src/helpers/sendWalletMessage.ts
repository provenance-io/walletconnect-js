import { WALLET_LIST } from '../consts';
import { SendWalletMessage } from '../types';

/* TODO:
Based on the request, we need to know the shape of the response we will be getting back from the wallet

- This is complicated as browser wallets will return a different shape from walletconnect wallets

- Result is known based on walletType (browser vs walletconnect) and request method. (what about "wallet_action"?)

- Need a fancy function type variable that will look at walletType and request method

- Could also only type "sendCustomRequest" and "browserEventAction", then "sendWalletMessage" would be an OR of those? I want clearer typing based on the wallet type though

*/

// Send the wallet a message, this can be a message to a browser wallet or walletconnect wallet
export const sendWalletMessage = async ({
  walletId,
  request,
  connector,
}: SendWalletMessage) => {
  // Pull out the target wallet to get this message
  const wallet = WALLET_LIST.find(({ id }) => id === walletId);
  if (wallet) {
    // Use a try/catch since walletconnect might die halfway through the request
    try {
      // Browser wallet message
      if (wallet.type === 'browser' && wallet.browserEventAction) {
        const { method } = request; // TODO: request is currently an any...
        const result = await wallet.browserEventAction(request, request);
        return { result, request };
      }
      // WalletConnect message
      else if (wallet.type === 'walletconnect' && connector) {
        const result = await connector.sendCustomRequest(request);
        return { result, request };
      }
      // Unknown wallet error
      return { error: 'Unknown wallet messaging value' };
    } catch (error) {
      return { error: `${error}`, request };
    }
  }
  return { error: 'Invalid walletId', request };
};
