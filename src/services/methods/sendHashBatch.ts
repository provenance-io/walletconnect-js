import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib/lib/services/message-service';
import { SendHashBatchData } from '../../types';
import { State } from '../walletConnectService';

export const sendHashBatch = async (state: State, data: SendHashBatchData) => {
  let valid = false;
  const {connector, address} = state;
  const {to: toAddress, amount: sendAmountHash, count, gasPrice } = data;
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
    jsonrpc: "2.0",
    method,
    params: [metadata],
  };

  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  // Convert hash amount to nhash (cannot send hash, can only send nhash)
  const sendAmountNHash = `${sendAmountHash * (10 ** 9)}`;

  const messageService = new MessageService();
  const sendMessage = {
    fromAddress: address,
    toAddress,
    amountList: [{ denom: 'nhash', amount: sendAmountNHash }],
  };
  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  // Create array of messages (duplicated for now, for testing)
  const messages = [];
  for (let i = 0; i < count; i += 1) {
    messages.push(hexMsg);
  }
  request.params.push(...messages);
  // Convert the amountList back into Hash (was converted to nHash before sending)
  const sentAmount = [{ denom: 'hash', amount: sendAmountHash}];
  try {
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result
    // result is a hex encoded signature
    return { valid, result, data: { ...data, sentAmount }, request };
  } catch (error) { return { valid, error, data: { ...data, sentAmount }, request }; }
};
