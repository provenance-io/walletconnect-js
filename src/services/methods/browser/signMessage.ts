import { convertUtf8ToHex } from '@walletconnect/utils';
import { PROVENANCE_METHODS } from '../../../consts';
import { verifySignature } from '../../../helpers';
import type { BrowserWallet } from '../../../types';
import { rngNum } from '../../../utils';

interface SignMessage {
  address: string;
  description?: string;
  customId?: string;
  message: string;
  isHex?: boolean;
  publicKey: string;
  wallet: BrowserWallet;
}

export const signMessage = async ({
  address,
  description = 'Sign Message',
  customId,
  message,
  isHex = true,
  publicKey: pubKeyB64,
  wallet,
}: SignMessage): Promise<any> => {
  const method = PROVENANCE_METHODS.SIGN;
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
  // If needed, convert the message to hex before adding to request params
  const hexMessage = isHex ? message : convertUtf8ToHex(message);
  request.params.push(hexMessage);
  // Send a message to the wallet containing the request and wait for a response
  const response = await wallet.browserEventAction(request, request);
  // result is a hex encoded signature
  const signature = Uint8Array.from(Buffer.from(response.result, 'hex'));
  // verify signature
  const valid = await verifySignature(hexMessage, signature, pubKeyB64);

  return { ...response, valid };
};
