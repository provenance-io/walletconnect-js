export {};
// import { convertUtf8ToHex } from '@walletconnect/utils';
// import { PROVENANCE_METHODS, WINDOW_MESSAGES } from '../../../consts';
// import { verifySignature } from '../../../helpers';
// import type { BroadcastEventData, WalletConnectClientType } from '../../../types';
// import { rngNum } from '../../../utils';

// interface SignHexMessage {
//   address: string;
//   connector?: WalletConnectClientType;
//   customId?: string;
//   message: string;
//   publicKey: string;
//   isHex?: boolean;
// }

// export const signMessage = async ({
//   address,
//   connector,
//   customId,
//   message,
//   publicKey: pubKeyB64,
//   isHex = true,
// }: SignHexMessage): Promise<
//   BroadcastEventData[typeof WINDOW_MESSAGES.SIGN_HEX_MESSAGE_COMPLETE]
// > => {
//   let valid = false;
//   const method = PROVENANCE_METHODS.SIGN;
//   const description = 'Sign Message';
//   const metadata = JSON.stringify({
//     description,
//     address,
//     date: Date.now(),
//     customId,
//   });
//   // Custom Request
//   const request = {
//     id: rngNum(),
//     jsonrpc: '2.0',
//     method,
//     params: [metadata],
//   };
//   // If needed, convert the message to hex before adding to request params
//   const hexMessage = isHex ? message : convertUtf8ToHex(message);
//   if (!connector) return { valid, request, error: 'No wallet connected' };
//   request.params.push(hexMessage);
//   try {
//     // send message
//     const result = (await connector.sendCustomRequest(request)) as string;
//     // result is a hex encoded signature
//     const signature = Uint8Array.from(Buffer.from(result, 'hex'));
//     // verify signature
//     valid = await verifySignature(hexMessage, signature, pubKeyB64);
//     return { valid, result: { signature: result }, request };
//   } catch (error) {
//     return { valid, error: `${error}`, request };
//   }
// };
