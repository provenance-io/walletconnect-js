import base64url from 'base64url';
import { PROVENANCE_NETWORK } from 'consts';
import { verifySignature } from './helpers';

export const signJWT = async (state) => {
  const { connector, address, publicKey } = state;
  const method = 'provenance_sign';
  // const type = 'MsgSend';

  if (!connector) return { method, error: 'No wallet connected' };
  // Build JWT
  const expires = Math.floor(Date.now() / 1000) + 900; // 900s (15min)
  const header = JSON.stringify({alg: 'ES256', typ: 'JWT'});
  const headerEncoded = base64url(header);
  const publicKeyEncoded = base64url(publicKey);
  const payload = JSON.stringify({sub: `${publicKeyEncoded},${address}`, iss: 'provenance.io', iat: expires, exp: expires});
  const payloadEncoded = base64url(payload);
  const jwtEncoded = base64url(`${header}.${payload}`);
  // encode message (hex)
  // const hexMsg = convertUtf8ToHex(message);
  // prov_sign params
  const msgParams = [address, jwtEncoded];
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
    const network = PROVENANCE_NETWORK;
    const valid = await verifySignature(jwtEncoded, signature, publicKey, network);
    // const { signedPayload } = result?.message;
    // const signedPayloadEncoded = base64url(signedPayload);
    // const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
    const signedJWT = `${headerEncoded}.${payloadEncoded}.${result}`;
    return { method, valid, result, signedJWT, address  };
  } catch (error) {
    return { method, valid: false, error };
  }
};
