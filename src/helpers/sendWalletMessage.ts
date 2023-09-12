import { WALLET_LIST } from '../consts';
import {
  BrowserWallet,
  WalletConnectClientType,
  WalletId,
  WalletMessageRequest,
} from '../types';

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
      if (wallet.messaging === 'browser') {
        /*
        eventData:
          walletId?: WalletId;
          browserEvent?: BrowserEventValue;
          uri?: string;
          address?: string;
          duration?: number;
          data?: WalletEventData;
          referral?: string;
          redirectUrl?: string;
          request?: WalletMessageRequest;
        */
        return await (wallet as BrowserWallet).browserEventAction(eventData);
      }
      // WalletConnect message
      else if (wallet.messaging === 'walletconnect' && connector) {
        return await connector.sendCustomRequest(request);
      }
      // Unknown wallet error
      return { error: 'Unknown wallet messaging value' };
    } catch (error) {
      return { error: `${error}` };
    }
  }
  return { error: 'Invalid walletId' };
};
