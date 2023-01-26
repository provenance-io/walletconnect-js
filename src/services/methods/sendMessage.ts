import { convertUtf8ToHex } from '@walletconnect/utils';
import type { WCSState, BroadcastResult, MethodSendMessageData } from '../../types';
import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';

export const sendMessage = async (
  state: WCSState,
  data: MethodSendMessageData
): Promise<BroadcastResult> => {
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
  const { connector, address, walletAppId } = state;
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
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);
  if (!connector) return { valid, data, request, error: 'No wallet connected' };

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
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result;

    // result is a hex encoded signature
    return { valid, result, data, request };
  } catch (error) {
    return { valid, error: `${error}`, data, request };
  }
};
