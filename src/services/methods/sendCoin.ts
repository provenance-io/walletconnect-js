import { convertUtf8ToHex } from "@walletconnect/utils";
import { MessageService } from '@provenanceio/wallet-lib';
import { SendCoinData } from '../../types';
import { State } from '../walletConnectService';

export const sendCoin = async (state: State, data: SendCoinData) => {
  let valid = false;
  const {connector, address} = state;
  const {to: toAddress, amount: initialAmount, denom: initialDenom = 'hash', gasPrice } = data;
  const method = 'provenance_sendTransaction';
  const type = 'MsgSend';
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

  const messageMsgSend = messageService.buildMessage(type, sendMessage);
  const message = messageService.createAnyMessageBase64(type, messageMsgSend);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  try {
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result
    // result is a hex encoded signature
    return { valid, result, data, request };
  } catch (error) { return { valid, error, data, request }; }
};
