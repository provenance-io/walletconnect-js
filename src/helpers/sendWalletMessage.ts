import { WALLET_LIST } from '../consts';
import { WalletConnectClientType, WalletId, WalletMessageRequest } from '../types';

interface SendWalletMessage {
  walletId: WalletId;
  request: WalletMessageRequest;
  connector?: WalletConnectClientType;
}

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
      if (wallet.browserEventAction) {
        const result = await wallet.browserEventAction(request);
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
