import base64url from 'base64url';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { GET_PROVENANCE_NETWORK } from '../../consts';
import { verifySignature, sha256 } from '../../helpers';

export const signJWT = async (state, networkName) => {
  const { connector, address, publicKey } = state;
  const method = 'provenance_sign';
  const network = GET_PROVENANCE_NETWORK(networkName);

  if (!connector) return { method, error: 'No wallet connected' };
  // Build JWT
  const now = Math.floor(Date.now() / 1000); // Current time
  const expires = now + 900; // 900s (15min)
  const header = JSON.stringify({alg: 'ES256K', typ: 'JWT'});
  const headerEncoded = base64url(header);
  const publicKeyEncoded = base64url(publicKey);
  const payload = JSON.stringify({
    sub: publicKeyEncoded,
    iss: 'provenance.io',
    iat: now,
    exp: expires,
    addr: address,
  });
  const payloadEncoded = base64url(payload);
  const jwtEncoded256 = sha256(`${headerEncoded}.${payloadEncoded}`);
  // prov_sign params
  const metadata = JSON.stringify({
    description: 'Sign JWT Token',
    address,
    public_key_b64: publicKeyEncoded,
    whatever: {
      even_more: 'stuff',
    },
  });
  const hexJWT256 = convertUtf8ToHex(jwtEncoded256);
  const msgParams = [metadata, hexJWT256];
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
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // verify signature
    const valid = await verifySignature(jwtEncoded256, signature, publicKey, network);
    // const { signedPayload } = result?.message;
    // const signedPayloadEncoded = base64url(signedPayload);
    // const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
    const signedJWT = `${headerEncoded}.${payloadEncoded}.${result}`;
    return { method, valid, result, signedJWT, address  };
  } catch (error) {
    return { method, valid: false, error };
  }
};
