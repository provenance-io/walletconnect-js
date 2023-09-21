export {};
// import { convertUtf8ToHex } from '@walletconnect/utils';
// import { PROVENANCE_METHODS } from '../../../consts';
// import type { BrowserWallet } from '../../../types';
// import { rngNum } from '../../../utils';

// interface SendMessage {
//   address: string;
//   customId?: string;
//   data: SendMessageMethod;
//   wallet: BrowserWallet;
// }

// export const sendMessage = async ({
//   address,
//   customId,
//   data,
//   wallet,
// }: SendMessage): Promise<any> => {
//   const {
//     message: rawB64Message,
//     description = 'Send Message',
//     method = PROVENANCE_METHODS.SEND,
//     gasPrice,
//     feeGranter,
//     feePayer,
//     memo,
//     timeoutHeight,
//     extensionOptions,
//     nonCriticalExtensionOptions,
//   } = data;
//   const metadata = JSON.stringify({
//     description,
//     address,
//     gasPrice,
//     date: Date.now(),
//     feeGranter,
//     feePayer,
//     memo,
//     customId,
//     timeoutHeight,
//     extensionOptions,
//     nonCriticalExtensionOptions,
//   });
//   // Custom Request
//   const request = {
//     id: rngNum(),
//     jsonrpc: '2.0',
//     method,
//     params: [metadata],
//   };

//   // If message isn't an array, turn it into one
//   const b64MessageArray = Array.isArray(rawB64Message)
//     ? rawB64Message
//     : [rawB64Message];

//   // Convert to hex and add to request
//   const hexMsgArray = b64MessageArray.map((msg) => convertUtf8ToHex(msg));
//   request.params.push(...hexMsgArray);

//   // Send a message to the wallet containing the request and wait for a response
//   const response = await wallet.browserEventAction(request, method);
//   // No result, or result error, or response code is 0
//   const hasError = !response || response.error || !response.result.txResponse.code;

//   return { valid: !hasError, ...response };
// };
