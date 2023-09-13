import { convertUtf8ToHex } from '@walletconnect/utils';
import base64url from 'base64url';
import { DEFAULT_CONNECTION_DURATION, PROVENANCE_METHODS } from '../../consts';
import { sendWalletMessage, verifySignature } from '../../helpers';
import type {
  SignJWTResponse,
  WalletConnectClientType,
  WalletId,
} from '../../types';
import { rngNum } from '../../utils';

interface SignJWT {
  address: string;
  connector?: WalletConnectClientType;
  customId?: string;
  expires?: number;
  publicKey: string;
  walletId: WalletId;
  description?: string;
}

export const signJWT = async ({
  address,
  connector,
  description = 'Sign JWT Token',
  customId,
  expires, // Custom expiration time in seconds from now
  publicKey: pubKeyB64,
  walletId,
}: SignJWT): Promise<SignJWTResponse> => {
  const nowSec = Math.round(Date.now() / 1000); // Current time seconds
  const customExpiresGiven = expires !== undefined;
  const defaultExpireSec = DEFAULT_CONNECTION_DURATION; // (24hours as seconds)
  const customExpiresSec = customExpiresGiven && expires;
  const finalExpiresSec =
    nowSec + (customExpiresGiven ? (customExpiresSec as number) : defaultExpireSec);
  const method = PROVENANCE_METHODS.SIGN;
  const metadata = JSON.stringify({
    address,
    customId,
    date: Date.now(),
    description,
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  // Build JWT
  const header = JSON.stringify({ alg: 'ES256K', typ: 'JWT' });
  const headerEncoded = base64url(header);
  const payload = JSON.stringify({
    sub: pubKeyB64,
    iss: 'provenance.io',
    iat: nowSec,
    exp: finalExpiresSec,
    addr: address,
  });
  const payloadEncoded = base64url(payload);
  const JWT = `${headerEncoded}.${payloadEncoded}`;

  const hexJWT = convertUtf8ToHex(JWT, true);
  request.params.push(hexJWT);

  // Send a message to the wallet containing the request and wait for a response
  const response = await sendWalletMessage({ request, walletId, connector });
  const signature = Buffer.from(response.result, 'hex');
  // verify signature
  const valid = await verifySignature(hexJWT, signature, pubKeyB64);

  return { ...response, valid };
};
