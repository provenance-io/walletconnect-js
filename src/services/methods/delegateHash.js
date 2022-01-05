import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
export const delegateHash = async (state, data) => {
  const method = 'provenance_delegate';
  const type = 'MsgDelegate';
  const description = 'Delegate Hash';
  const {connector, address} = state;
  const { validatorAddress, amount } = data;
  
  if (!connector) return { method, error: 'No wallet connected' };

  const messageService = new MessageService();
  const sendMessage = {
    delegatorAddress: address,
    validatorAddress,
    amount: { denom: "nhash", amount },
  };
  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);

  const metadata = JSON.stringify({
    description,
    address,
  });
  // provenance_signTransaction params
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
