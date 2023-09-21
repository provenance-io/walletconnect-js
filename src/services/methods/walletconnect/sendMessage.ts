export {};
// import { convertUtf8ToHex } from '@walletconnect/utils';
// import { PROVENANCE_METHODS, WINDOW_MESSAGES } from '../../../consts';
// import type {
//   BroadcastEventData,
//   SendMessageMethod,
//   SendMessageMethodResult,
//   WalletConnectClientType,
// } from '../../../types';
// import { log, rngNum } from '../../../utils';

// interface SendMessage {
//   address: string;
//   connector?: WalletConnectClientType;
//   customId?: string;
//   data: SendMessageMethod;
//   logsEnabled: boolean;
// }

// export const sendMessage = async ({
//   address,
//   connector,
//   customId,
//   data,
//   logsEnabled,
// }: SendMessage): Promise<
//   BroadcastEventData[typeof WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE]
// > => {
//   let valid = false;
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
//   if (!connector) return { valid, request, error: 'No wallet connected' };

//   // If message isn't an array, turn it into one
//   const b64MessageArray = Array.isArray(rawB64Message)
//     ? rawB64Message
//     : [rawB64Message];
//   // Convert to hex
//   const hexMsgArray = b64MessageArray.map((msg) => convertUtf8ToHex(msg));
//   request.params.push(...hexMsgArray);
//   try {
//     // send message
//     // Logging to help track down rare, rogue bug where dApp hangs waiting on response
//     log(logsEnabled, `sendMessage | request sent to wallet: `, request);
//     const result = (await connector.sendCustomRequest(
//       request
//     )) as SendMessageMethodResult;
//     log(logsEnabled, `sendMessage | result sent to wallet: `, result);
//     // Check to see if we had an error in the txResponse
//     if (result && result.txResponse && result.txResponse.code) {
//       // Any code, other than 0, means there is a problem
//       valid = false;
//       return { valid, result, error: result.txResponse.rawLog, request };
//     }

//     return { valid: true, result, request };
//   } catch (error) {
//     return { valid, error: `${error}`, request };
//   }
// };
