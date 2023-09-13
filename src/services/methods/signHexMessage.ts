import { convertUtf8ToHex } from '@walletconnect/utils';
import { PROVENANCE_METHODS } from '../../consts';
import { sendWalletMessage, verifySignature } from '../../helpers';
import type {
  SignMessageResponse,
  WalletConnectClientType,
  WalletId,
} from '../../types';
import { rngNum } from '../../utils';

interface SignMessage {
  address: string;
  description?: string;
  connector?: WalletConnectClientType;
  customId?: string;
  message: string;
  isHex?: boolean;
  publicKey: string;
  walletId: WalletId;
}

export const signMessage = async ({
  address,
  connector,
  description = 'Sign Message',
  customId,
  message,
  isHex = true,
  publicKey: pubKeyB64,
  walletId,
}: SignMessage): Promise<SignMessageResponse> => {
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
  const response = await sendWalletMessage({ request, walletId, connector });
  // result is a hex encoded signature
  const signature = Uint8Array.from(Buffer.from(response.result, 'hex'));
  // verify signature
  const valid = await verifySignature(hexMessage, signature, pubKeyB64);

  return { ...response, valid };
};
