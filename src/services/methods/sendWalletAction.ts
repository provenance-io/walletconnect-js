import {
  WALLET_LIST,
  WALLET_APP_EVENTS,
  PROVENANCE_METHODS,
  WINDOW_MESSAGES,
} from '../../consts';
import { rngNum } from '../../utils';
import type {
  BroadcastEventData,
  WalletConnectClientType,
  WalletId,
  SendWalletActionMethod,
} from '../../types';

interface SendWalletAction {
  connector?: WalletConnectClientType;
  data: SendWalletActionMethod;
  iframeParentId?: string;
  walletAppId?: WalletId;
}

export const sendWalletAction = async ({
  connector,
  data,
  iframeParentId,
  walletAppId,
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
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);

  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT, data, iframeParentId };
      knownWalletApp.eventAction(eventData);
    }

    // send message
    const requestOptions = { forcePushNotification: true };
    const result = await connector.sendCustomRequest(request, requestOptions);

    return {
      valid: !!result,
      result,
      request,
    };
  } catch (error) {
    return { valid: false, error: `${error}`, request };
  }
};
