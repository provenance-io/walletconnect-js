import { PROVENANCE_METHODS, WALLET_LIST, WINDOW_MESSAGES } from '../../consts';
import { sendWalletMessage, verifySignature } from '../../helpers';
import type {
  BroadcastEventData,
  WalletConnectClientType,
  WalletId,
} from '../../types';
import { rngNum } from '../../utils';

interface SignHexMessage {
  address: string;
  connector?: WalletConnectClientType;
  customId?: string;
  hexMessage: string;
  publicKey: string;
  walletId?: WalletId;
}

export const signHexMessage = async ({
  address,
  connector,
  customId,
  hexMessage,
  publicKey: pubKeyB64,
  walletId,
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
  // if (!connector) return { valid, request, error: 'No wallet connected' };
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletId);
  request.params.push(hexMessage);
  try {
    let result = '';
    // If the wallet app has an eventAction (web/extension) trigger it
    result = await sendWalletMessage({ request, walletId });
    if (connector) {
      // send message
      result = (await connector.sendCustomRequest(request)) as string;
    }
    // result is a hex encoded signature
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // verify signature
    valid = await verifySignature(hexMessage, signature, pubKeyB64);

    return { valid, result: { signature: result }, request };
  } catch (error) {
    return { valid, error: `${error}`, request };
  }
};
