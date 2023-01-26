import base64url from 'base64url';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { verifySignature } from '../../helpers';
import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';
import type { BroadcastResult, WCSState, WCSSetState } from '../../types';

/**
 *
 * @param state WalletConnectService State
 * @param setState SetWalletConnectService State function
 * @param expires Expiration time in seconds from now
 * @returns Result object with data or with error
 */
export const signJWT = async (
  state: WCSState,
  setState: WCSSetState,
  expires?: number // Custom expiration time in seconds from now
): Promise<BroadcastResult> => {
  let valid = false;
  const nowSec = Math.round(Date.now() / 1000); // Current time seconds
  const customExpiresGiven = expires !== undefined;
  const defaultExpireSec = 1440; // (24hours as seconds)
  const customExpiresSec = customExpiresGiven && expires;
  const finalExpiresSec =
    nowSec + (customExpiresGiven ? (customExpiresSec as number) : defaultExpireSec);
  const { connector, address, publicKey: pubKeyB64, walletAppId } = state;
  const method = PROVENANCE_METHODS.sign;
  const description = 'Sign JWT Token';
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
    return {
      valid,
      data: { expires: finalExpiresSec },
      request,
      error: 'No wallet connected',
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

  const hexJWT = convertUtf8ToHex(JWT);
  request.params.push(hexJWT);

  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT };
      knownWalletApp.eventAction(eventData);
    }
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
    setState({ signedJWT });
    return {
      valid,
      result,
      data: { signedJWT, expires: finalExpiresSec },
      request,
    };
  } catch (error) {
    return { valid, error: `${error}`, data: { expires: finalExpiresSec }, request };
  }
};
