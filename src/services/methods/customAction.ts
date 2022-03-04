import { convertUtf8ToHex } from "@walletconnect/utils";
import { CustomActionData } from 'types';
import { State } from '../walletConnectService';

export const customAction = async (state: State, data: CustomActionData) => {
  let valid = false;
  const { message: rawB64Message, description = 'Custom Action', method = 'provenance_sendTransaction' } = data;
  const { connector, address } = state;
  if (!connector) return { method, valid, error: 'No wallet connected' };
  // If message isn't an array, turn it into one
  const b64MessageArray = Array.isArray(rawB64Message) ? rawB64Message : [rawB64Message];
  // Convert to hex
  const hexMsgArray = b64MessageArray.map((msg) => convertUtf8ToHex(msg))
  // Build metadata
  const metadata = JSON.stringify({
    description,
    address,
  });
  // Final message params
  const msgParams = [metadata, ...hexMsgArray];
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

    // result is a hex encoded signature
    return { method, valid, result, b64MessageArray, description };
  } catch (error) { return { method, valid, error, description }; }
};
