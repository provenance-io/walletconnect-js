export {};
// import { convertUtf8ToHex } from '@walletconnect/utils';
// import base64url from 'base64url';
// import { PROVENANCE_METHODS, WINDOW_MESSAGES } from '../../../consts';
// import { verifySignature } from '../../../helpers';
// import type {
//   BroadcastEventData,
//   WCSSetState,
//   WalletConnectClientType,
// } from '../../../types';
// import { rngNum } from '../../../utils';

// interface SignJWT {
//   address: string;
//   connector?: WalletConnectClientType;
//   customId?: string;
//   expires?: number;
//   publicKey: string;
//   setState: WCSSetState;
// }

// export const signJWT = async ({
//   address,
//   connector,
//   customId,
//   expires, // Custom expiration time in seconds from now
//   publicKey: pubKeyB64,
//   setState,
// }: SignJWT): Promise<
//   BroadcastEventData[typeof WINDOW_MESSAGES.SIGN_JWT_COMPLETE]
// > => {
//   let valid = false;
//   const nowSec = Math.round(Date.now() / 1000); // Current time seconds
//   const customExpiresGiven = expires !== undefined;
//   const defaultExpireSec = 1440; // (24hours as seconds)
//   const customExpiresSec = customExpiresGiven && expires;
//   const finalExpiresSec =
//     nowSec + (customExpiresGiven ? (customExpiresSec as number) : defaultExpireSec);
//   const method = PROVENANCE_METHODS.SIGN;
//   const description = 'Sign JWT Token';
//   const metadata = JSON.stringify({
//     address,
//     customId,
//     date: Date.now(),
//     description,
//   });
//   // Custom Request
//   const request = {
//     id: rngNum(),
//     jsonrpc: '2.0',
//     method,
//     params: [metadata],
//   };
//   if (!connector)
//     return {
//       valid,
//       request,
//       error: 'No wallet connected',
//     };
//   // Build JWT
//   const header = JSON.stringify({ alg: 'ES256K', typ: 'JWT' });
//   const headerEncoded = base64url(header);
//   const payload = JSON.stringify({
//     sub: pubKeyB64,
//     iss: 'provenance.io',
//     iat: nowSec,
//     exp: finalExpiresSec,
//     addr: address,
//   });
//   const payloadEncoded = base64url(payload);
//   const JWT = `${headerEncoded}.${payloadEncoded}`;

//   const hexJWT = convertUtf8ToHex(JWT, true);
//   request.params.push(hexJWT);

//   try {
//     // send message
//     const result = (await connector.sendCustomRequest(request)) as string;
//     // result is a hex encoded signature
//     // const signature = Uint8Array.from(Buffer.from(result, 'hex'));
//     const signature = Buffer.from(result, 'hex');
//     // verify signature
//     valid = await verifySignature(hexJWT, signature, pubKeyB64);
//     const signedPayloadEncoded = base64url(signature);
//     const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
//     // Update JWT within the wcjs state
//     setState({ signedJWT });
//     return {
//       valid,
//       result: { signature: result, signedJWT, expires: finalExpiresSec },
//       request,
//     };
//   } catch (error) {
//     return { valid, error: `${error}`, request };
//   }
// };
