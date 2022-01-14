import { convertUtf8ToHex } from "@walletconnect/utils";

export const customAction = async (state, data) => {
  const { message: b64Message, description = 'Custom Action', method = 'provenance_sendTransaction' } = data;
  const { connector, address } = state;
  
  if (!connector) return { method, error: 'No wallet connected' };

  /* Sample Base64 Message from asset-onboarding

  CiwvcHJvdmVuYW5jZS5tZXRhZGF0YS52MS5Nc2dXcml0ZVNjb3BlUmVxdWVzdBLQAgrWAQoRAMaXjUY8PkF1oNKPjOR+i7YSEQRVG17Kkh1Lp63tOWayJPRLGi0KKXRwMXo2Nm1ka2RmYzByaDJ0ZzJzMzc4Y3prM25yc3I5c3hzOHgzaGxhEAUiKXRwMXo2Nm1ka2RmYzByaDJ0ZzJzMzc4Y3prM25yc3I5c3hzOHgzaGxhIil0cDFzNWV3dDgwN3dmODlkMGd4d3Y5M25yNHNjbWE5eGFhczM1eWh0MCopdHAxejY2bWRrZGZjMHJoMnRnMnMzNzhjemszbnJzcjlzeHM4eDNobGESKXRwMXo2Nm1ka2RmYzByaDJ0ZzJzMzc4Y3prM25yc3I5c3hzOHgzaGxhGiRjNjk3OGQ0Ni0zYzNlLTQxNzUtYTBkMi04ZjhjZTQ3ZThiYjYiJDU1MWI1ZWNhLTkyMWQtNGJhNy1hZGVkLTM5NjZiMjI0ZjQ0Yg==

  */


  // Base64 decode
  // const decodedMsg = atob(b64Message);
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
    const valid = !!result

    // result is a hex encoded signature
    return { method, valid, result, b64Message };
  } catch (error) { return { method, valid: false, error }; }
};
