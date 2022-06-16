import { convertUtf8ToHex } from '@walletconnect/utils';
import { Message } from 'google-protobuf';
import {
  buildMessage,
  createAnyMessageBase64,
} from '@provenanceio/wallet-utils';
import { SendHashData } from '../../types';
import { State } from '../walletConnectService';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';

/**
 * @deprecated Use sendCoin instead of sendHash
 */
export const sendHash = async (state: State, data: SendHashData) => {
  let valid = false;
  const { connector, address, walletApp, customExtId } = state;
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
  };

  // Wallet App must exist
  if (!walletApp) return { valid, error: 'Wallet app is missing', data, request };
  const activeWalletApp = WALLET_LIST.find(wallet => wallet.id === walletApp);
  if (!activeWalletApp) return { valid, error: 'Invalid active wallet app', data, request };
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
    // If the wallet app has an eventAction (web/extension) trigger it
    if (activeWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT , customExtId };
      activeWalletApp.eventAction(eventData);
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
