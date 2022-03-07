import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';
import { SendHashData } from 'types';
import { State } from '../walletConnectService';

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
export const delegateHash = async (state: State, data: SendHashData) => {
  let valid = false;
  const method = 'provenance_sendTransaction';
  const type = 'MsgDelegate';
  const description = 'Delegate Hash';
  const {connector, address} = state;
  const { validatorAddress, amount: sendAmountHash, gasPrice } = data;
  
  if (!connector) return { method, valid, error: 'No wallet connected' };

  // Convert hash amount to nhash (cannot send hash, can only send nhash)
  const sendAmountNHash = sendAmountHash * (10 ** 9);

  const messageService = new MessageService();
  const sendMessage = {
    delegatorAddress: address,
    validatorAddress,
    amount: { denom: "nhash", amount: sendAmountNHash },
  };
  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);

  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
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
    valid = !!result
    // Convert the amountList back into Hash (was converted to nHash before sending)
    const amountList = { denom: 'hash', amount: sendAmountHash};
    // result is a hex encoded signature
    return { method, valid, result, message, sendDetails: {...sendMessage, amount: amountList} };
  } catch (error) { return { method, valid, error }; }
};
