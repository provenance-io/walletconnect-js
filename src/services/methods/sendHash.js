import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';

export const sendHash = async (state, data) => {
  const {connector, address} = state;
  const {to: toAddress, amount: sendAmount} = data;
  const method = 'provenance_sendTransaction';
  const type = 'MsgSend';
  
  if (!connector) return { method, error: 'No wallet connected' };

  const messageService = new MessageService();
  const sendMessage = {
    fromAddress: address,
    toAddress,
    amountList: [{ denom: "nhash", amount: sendAmount }],
  };
  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);

  // provenance_signTransaction params
  const metadata = JSON.stringify({
    description: 'Send Hash',
    address,
    whatever: {
      even_more: 'stuff',
    }
  });
  const msgParams = [metadata, hexMsg];
  try {
    // Custom Request
    const customRequest = {
      id: 1,
      jsonrpc: "2.0",
      method,
      params: msgParams,
    };
    // send message
    const result = await connector.sendCustomRequest(customRequest);
    // TODO verify transaction ID
    const valid = !!result
    // result is a hex encoded signature
    return { method, valid, result, message, sendDetails: sendMessage };
  } catch (error) { return { method, valid: false, error }; }
};
