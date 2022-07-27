import { convertUtf8ToHex } from '@walletconnect/utils';
import { Message } from 'google-protobuf';
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils';
import { SendHashData } from '../../types';
import { State } from '../walletConnectService';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
export const delegateHash = async (state: State, data: SendHashData) => {
  let valid = false;
  const method = 'provenance_sendTransaction';
  const type = 'MsgDelegate';
  const description = 'Delegate Hash';
  const { connector, address, walletApp } = state;
  const { validatorAddress, amount: sendAmountHash, gasPrice } = data;
  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
    date: Date.now(),
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };

  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletApp);
  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  // Convert hash amount to nhash (cannot send hash, can only send nhash)
  const sendAmountNHash = sendAmountHash * 10 ** 9;

  const sendMessage = {
    delegatorAddress: address,
    validatorAddress,
    amount: { denom: 'nhash', amount: sendAmountNHash },
  };
  const messageMsgSend = buildMessage(type, sendMessage);
  const message = createAnyMessageBase64(type, messageMsgSend as Message);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  // Convert the amountList back into Hash (was converted to nHash before sending)
  const sentAmount = { denom: 'hash', amount: sendAmountHash };
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT };
      knownWalletApp.eventAction(eventData);
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
