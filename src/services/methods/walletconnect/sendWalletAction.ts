import { PROVENANCE_METHODS, WINDOW_MESSAGES } from '../../../consts';
import type {
  BroadcastEventData,
  SendWalletActionMethod,
  WalletConnectClientType,
} from '../../../types';
import { rngNum } from '../../../utils';

interface SendWalletAction {
  connector?: WalletConnectClientType;
  data: SendWalletActionMethod;
}

export const sendWalletAction = async ({
  connector,
  data,
}: SendWalletAction): Promise<
  BroadcastEventData[
    | typeof WINDOW_MESSAGES.SWITCH_TO_GROUP_COMPLETE
    | typeof WINDOW_MESSAGES.REMOVE_PENDING_METHOD_COMPLETE]
> => {
  const {
    description = 'Send Wallet Action',
    method = PROVENANCE_METHODS.ACTION,
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

  try {
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
