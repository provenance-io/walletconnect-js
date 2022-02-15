import base64url from 'base64url';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { verifySignature } from '../../helpers';
import { State } from '../walletConnectService';

export const signJWT = async (state: State) => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64 } = state;
  const method = 'provenance_sign';
  const description = 'Sign JWT Token';

  if (!connector) return { method, valid, error: 'No wallet connected' };
  // Build JWT
  const now = Math.floor(Date.now() / 1000); // Current time
  const expires = now + 3600; // (60min)
  const header = JSON.stringify({alg: 'ES256K', typ: 'JWT'});
  const headerEncoded = base64url(header);
  const payload = JSON.stringify({
    sub: pubKeyB64,
    iss: 'provenance.io',
    iat: now,
    exp: expires,
    addr: address,
  });
  const payloadEncoded = base64url(payload);
  const JWT = `${headerEncoded}.${payloadEncoded}`;
  // prov_sign params
  const metadata = JSON.stringify({
    description,
    address,
    public_key_b64: pubKeyB64,
  });
  const hexJWT = convertUtf8ToHex(JWT);
  const msgParams = [metadata, hexJWT];
  // Custom Request
  const customRequest = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params: msgParams,
  };
  try {
    // send message
    const result = await connector.sendCustomRequest(customRequest);
    // result is a hex encoded signature
    // const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    const signature = Buffer.from(result, 'hex');
    // verify signature
    valid = await verifySignature(JWT, signature, pubKeyB64);
    const signedPayloadEncoded = base64url(signature);
    const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
    return { method, valid, result, signedJWT, address  };
  } catch (error) {
    return { method, valid, error };
  }
};
