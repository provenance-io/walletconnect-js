import base64url from 'base64url';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { verifySignature } from '../../helpers';
import { State, SetState } from '../walletConnectService';

export const signJWT = async (state: State, setState: SetState, expires: number) => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64 } = state;
  const method = 'provenance_sign';
  const description = 'Sign JWT Token';
  const metadata = JSON.stringify({
    description,
    address,
  });
  // Custom Request
  const request = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params: [metadata],
  };

  if (!connector) return { valid, data: expires, request, error: 'No wallet connected' };
  // Build JWT
  const now = Math.floor(Date.now() / 1000); // Current time
  const defaultExpires = now + 86400; // (24hours)
  const finalExpires = expires || defaultExpires;
  const header = JSON.stringify({alg: 'ES256K', typ: 'JWT'});
  const headerEncoded = base64url(header);
  const payload = JSON.stringify({
    sub: pubKeyB64,
    iss: 'provenance.io',
    iat: now,
    exp: finalExpires,
    addr: address,
  });
  const payloadEncoded = base64url(payload);
  const JWT = `${headerEncoded}.${payloadEncoded}`;
  
  const hexJWT = convertUtf8ToHex(JWT);
  request.params.push(hexJWT);
  
  try {
    // send message
    const result = await connector.sendCustomRequest(request);
    // result is a hex encoded signature
    // const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    const signature = Buffer.from(result, 'hex');
    // verify signature
    valid = await verifySignature(JWT, signature, pubKeyB64);
    const signedPayloadEncoded = base64url(signature);
    const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
    // Update JWT within the wcjs state
    setState({ signedJWT })
    return { valid, result, data: expires, signedJWT, request  };
  } catch (error) {
    return { valid, error, data: expires, request };
  }
};
