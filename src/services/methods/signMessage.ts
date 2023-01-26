import { verifySignature } from '../../helpers';
import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';
import type { WCSState, BroadcastResult } from '../../types';

export const signMessage = async (
  state: WCSState,
  hexMessage: string
): Promise<BroadcastResult> => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64, walletAppId } = state;
  const method = PROVENANCE_METHODS.sign;
  const description = 'Sign Message';
  const metadata = JSON.stringify({
    description,
    address,
    date: Date.now(),
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
  if (!connector)
    return { valid, data: hexMessage, request, error: 'No wallet connected' };
  request.params.push(hexMessage);
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT };
      knownWalletApp.eventAction(eventData);
    }
    // send message
    const result = await connector.sendCustomRequest(request);
    // result is a hex encoded signature
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // un-hex the message to verify the signature (the wallet signs the un-hexed message)
    const message = Buffer.from(hexMessage, 'hex').toString();
    // verify signature
    valid = await verifySignature(message, signature, pubKeyB64);
    return { valid, result, data: hexMessage, request };
  } catch (error) {
    return { valid, error: `${error}`, data: hexMessage, request };
  }
};
