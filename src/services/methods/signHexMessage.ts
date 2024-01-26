import { verifySignature } from '../../helpers';
import {
  WALLET_LIST,
  WALLET_APP_EVENTS,
  PROVENANCE_METHODS,
  WINDOW_MESSAGES,
} from '../../consts';
import { rngNum } from '../../utils';
import type {
  WalletConnectClientType,
  WalletId,
  BroadcastEventData,
} from '../../types';

interface SignHexMessage {
  address: string;
  connector?: WalletConnectClientType;
  customId?: string;
  hexMessage: string;
  iframeParentId?: string;
  publicKey: string;
  walletAppId?: WalletId;
}

export const signHexMessage = async ({
  address,
  connector,
  customId,
  hexMessage,
  iframeParentId,
  publicKey: pubKeyB64,
  walletAppId,
}: SignHexMessage): Promise<
  BroadcastEventData[typeof WINDOW_MESSAGES.SIGN_HEX_MESSAGE_COMPLETE]
> => {
  let valid = false;
  const method = PROVENANCE_METHODS.sign;
  const description = 'Sign Message';
  const metadata = JSON.stringify({
    description,
    address,
    date: Date.now(),
    customId,
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  if (!connector) return { valid, request, error: 'No wallet connected' };
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);
  request.params.push(hexMessage);
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT, iframeParentId };
      knownWalletApp.eventAction(eventData);
    }
    // send message
    const requestOptions = { forcePushNotification: true };
    const result = (await connector.sendCustomRequest(
      request,
      requestOptions
    )) as string;
    // result is a hex encoded signature
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // verify signature
    valid = await verifySignature(hexMessage, signature, pubKeyB64);
    return { valid, result: { signature: result }, request };
  } catch (error) {
    return { valid, error: `${error}`, request };
  }
};
