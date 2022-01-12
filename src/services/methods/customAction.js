import { convertUtf8ToHex } from "@walletconnect/utils";

export const customAction = async (state, data) => {
  const { message: b64Message, metadata, method = 'provenance_sendTransaction' } = data;
  const { connector } = state;
  
  if (!connector) return { method, error: 'No wallet connected' };

  // Convert metadata to json string
  const stringMetadata = JSON.stringify(metadata);
  // Base64 decode
  const decodedMsg = atob(b64Message);
  // encode message (hex)
  const hexMsg = convertUtf8ToHex(decodedMsg);

  // provenance_signTransaction params
  const msgParams = [stringMetadata, hexMsg];
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
    return { method, valid, result, decodedMsg };
  } catch (error) { return { method, valid: false, error }; }
};
