import { convertUtf8ToHex } from '@walletconnect/utils';
import { Message } from 'google-protobuf';
import {
  buildMessage,
  createAnyMessageBase64,
} from '@provenanceio/wallet-utils';
import { SendHashData } from '../../types';
import { State } from '../walletConnectService';

/**
 * @deprecated Use sendCoin instead of sendHash
 */
export const sendHash = async (state: State, data: SendHashData) => {
  let valid = false;
  const { connector, address, connectionType, extensionId } = state;
  const { to: toAddress, amount: sendAmountHash, gasPrice } = data;
  const method = 'provenance_sendTransaction';
  const type = 'MsgSend';
  const description = 'Send Hash';
  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
  });
  // Custom Request
  const request = {
    id: 1,
    jsonrpc: '2.0',
    method,
    params: [metadata],
    date: Date.now(),
  };

  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  // Convert hash amount to nhash (cannot send hash, can only send nhash)
  const sendAmountNHash = `${sendAmountHash * 10 ** 9}`;

  const sendMessage = {
    fromAddress: address,
    toAddress,
    amountList: [{ denom: 'nhash', amount: sendAmountNHash }],
  };
  const messageMsgSend = buildMessage(type, sendMessage);
  const message = createAnyMessageBase64(type, messageMsgSend as Message);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  // Convert the amountList back into Hash (was converted to nHash before sending)
  const sentAmount = [{ denom: 'hash', amount: sendAmountHash }];
  try {
    // If we are using a browser extension wallet, pop open the notification page before sending the request
    if (connectionType === 'extension' && extensionId) {
      const extData = { event: 'walletconnect_event' };
      window?.chrome.runtime.sendMessage(extensionId, extData);
    }
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result;
    // result is a hex encoded signature
    return { valid, result, data: { ...data, sentAmount }, request };
  } catch (error) {
    return { valid, error, data: { ...data, sentAmount }, request };
  }
};
