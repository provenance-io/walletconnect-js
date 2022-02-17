import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';
import { SendCoinData } from 'types';
import { State } from '../walletConnectService';

export const sendCoin = async (state: State, data: SendCoinData) => {
  let valid = false;
  const {connector, address} = state;
  const {to: toAddress, amount: initialAmount, denom: initialDenom = 'hash' } = data;
  const method = 'provenance_sendTransaction';
  const type = 'MsgSend';
  
  if (!connector) return { method, valid, error: 'No wallet connected' };
  let amount = initialAmount;
  let denom = initialDenom.toLowerCase();
  if (denom === 'hash') {
    // Convert hash amount to nhash (cannot send hash, can only send nhash)
    amount = initialAmount * (10 ** 9);
    denom = 'nhash';
  }
  // Set amount to string value
  const amountString = `${amount}`;
  const description = `Send Coin (${denom})`;
  const messageService = new MessageService();
  const sendMessage = {
    fromAddress: address,
    toAddress,
    amountList: [{ denom, amount: amountString }],
  };
  console.log('sendMessage :', sendMessage);
  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);

  // provenance_signTransaction params
  const metadata = JSON.stringify({
    description,
    address,
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
    valid = !!result
    // Convert the amountList back into Hash (was converted to nHash before sending)
    const amountList = [{ denom, amount: amountString }];
    // result is a hex encoded signature
    return { method, valid, result, message, sendDetails: {...sendMessage, amountList} };
  } catch (error) { return { method, valid, error }; }
};
