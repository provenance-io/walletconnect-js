import {
  PROVENANCE_METHODS,
  WALLET_APP_EVENTS,
  WALLET_LIST,
  WINDOW_MESSAGES,
} from '../../consts';
import type {
  BroadcastEventData,
  SendWalletActionMethod,
  WalletConnectClientType,
  WalletId,
} from '../../types';
import { rngNum } from '../../utils';

interface SendWalletAction {
  connector?: WalletConnectClientType;
  data: SendWalletActionMethod;
  walletId?: WalletId;
}

export const sendWalletAction = async ({
  connector,
  walletId,
  data,
}: SendWalletAction): Promise<
  BroadcastEventData[
    | typeof WINDOW_MESSAGES.SWITCH_TO_GROUP_COMPLETE
    | typeof WINDOW_MESSAGES.REMOVE_PENDING_METHOD_COMPLETE]
> => {
  const {
    description = 'Send Wallet Action',
    method = PROVENANCE_METHODS.action,
    action,
    payload,
  } = data;
  const metadata = JSON.stringify({
    description,
    action,
    payload,
    date: Date.now(),
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  if (!connector) return { valid: false, request, error: 'No wallet connected' };

  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletId);

  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT, data };
      knownWalletApp.eventAction(eventData);
    }

    // send message
    const result = await connector.sendCustomRequest(request);

    return {
      valid: !!result,
      result,
      request,
    };
  } catch (error) {
    return { valid: false, error: `${error}`, request };
  }
};
