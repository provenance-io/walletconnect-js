import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';

export const sendHash = async (state, data) => {
  const {connector, address} = state;
  const {to: toAddress, amount: sendAmountHash } = data;
  const method = 'provenance_sendTransaction';
  const type = 'MsgSend';
  
  if (!connector) return { method, error: 'No wallet connected' };

  // Convert hash amount to nhash (cannot send hash, can only send nhash)
  const sendAmountNHash = sendAmountHash * (10 ** 9);

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
    // Convert the amountList back into Hash (was converted to nHash before sending)
    const amountList = [{ denom: 'hash', amount: sendAmountHash}];
    // result is a hex encoded signature
    return { method, valid, result, message, sendDetails: {...sendMessage, amountList} };
  } catch (error) { return { method, valid: false, error }; }
};
