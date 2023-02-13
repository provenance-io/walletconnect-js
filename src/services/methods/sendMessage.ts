import { convertUtf8ToHex } from '@walletconnect/utils';
import type {
  BroadcastResult,
  SendMessageMethod,
  WalletConnectClientType,
  WalletId,
  SendMessageResult,
} from '../../types';
import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';

interface SendMessage {
  address: string;
  connector?: WalletConnectClientType;
  data: SendMessageMethod;
  walletAppId?: WalletId;
}

export const sendMessage = async ({
  address,
  connector,
  data,
  walletAppId,
}: SendMessage): Promise<BroadcastResult> => {
  let valid = false;
  const {
    message: rawB64Message,
    description = 'Send Message',
    method = PROVENANCE_METHODS.send,
    gasPrice,
    feeGranter,
    feePayer,
    memo,
    timeoutHeight,
    extensionOptions,
    nonCriticalExtensionOptions,
  } = data;
  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
    date: Date.now(),
    feeGranter,
    feePayer,
    memo,
    timeoutHeight,
    extensionOptions,
    nonCriticalExtensionOptions,
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  if (!connector) return { valid, data, request, error: 'No wallet connected' };
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);

  // If message isn't an array, turn it into one
  const b64MessageArray = Array.isArray(rawB64Message)
    ? rawB64Message
    : [rawB64Message];
  // Convert to hex
  const hexMsgArray = b64MessageArray.map((msg) => convertUtf8ToHex(msg));
  request.params.push(...hexMsgArray);
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT };
      knownWalletApp.eventAction(eventData);
    }
    // send message
    const result = (await connector.sendCustomRequest(request)) as SendMessageResult;
    // Check to see if we had an error in the txResponse
    if (result && result.txResponse && result.txResponse.code) {
      // Any code, other than 0, means there is a problem
      valid = false;
      return { valid, result, error: result.txResponse.rawLog, data, request };
    }

    return { valid: true, result, data, request };
  } catch (error) {
    return { valid, error: `${error}`, data, request };
  }
};
