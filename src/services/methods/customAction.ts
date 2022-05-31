import { convertUtf8ToHex } from "@walletconnect/utils";
import { CustomActionData } from '../../types';
import { State } from '../walletConnectService';

export const customAction = async (state: State, data: CustomActionData) => {
  let valid = false;
  const {
    message: rawB64Message,
    description = 'Custom Action',
    method = 'provenance_sendTransaction',
    gasPrice,
  } = data;
  const { connector, address, connectionType, extensionId } = state;
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
    date: Date.now(),
  };

  if (!connector) return { valid, data, request, error: 'No wallet connected' };
  // If message isn't an array, turn it into one
  const b64MessageArray = Array.isArray(rawB64Message) ? rawB64Message : [rawB64Message];
  // Convert to hex
  const hexMsgArray = b64MessageArray.map((msg) => convertUtf8ToHex(msg))
  request.params.push(...hexMsgArray);
  try {
    // If we are using a browser extension wallet, pop open the notification page before sending the request
    if (connectionType === 'extension' && extensionId) {
      const extData = { event: 'walletconnect_event' };
      window?.chrome.runtime.sendMessage(extensionId, extData);
    }
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result

    // result is a hex encoded signature
    return { valid, result, data, request };
  } catch (error) { return { valid, error, data, request }; }
};
