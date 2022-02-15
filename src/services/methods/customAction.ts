import { convertUtf8ToHex } from "@walletconnect/utils";
import { CustomActionData } from 'types';
import { State } from '../walletConnectService';

export const customAction = async (state: State, data: CustomActionData) => {
  let valid = false;
  const { message: b64Message, description = 'Custom Action', method = 'provenance_sendTransaction' } = data;
  const { connector, address } = state;
  if (!connector) return { method, valid, error: 'No wallet connected' };
  // Convert to hex
  const hexMsg = convertUtf8ToHex(b64Message);
  // Build metadata
  const metadata = JSON.stringify({
    description,
    address,
  });
  // Final message params
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

    // result is a hex encoded signature
    return { method, valid, result, b64Message };
  } catch (error) { return { method, valid, error }; }
};
