import { convertUtf8ToHex } from "@walletconnect/utils";
import { verifySignature } from '../../helpers';

export const signMessage = async (state, message) => {
  const { connector, address, publicKey: pubKeyB64 } = state;
  const method = 'provenance_sign';
  // const type = 'MsgSend';

  if (!connector) return { method, error: 'No wallet connected' };
  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  // eth_sign params
  const metadata = JSON.stringify({
    description: 'Sign Message',
    address,
  });
  const msgParams = [metadata, hexMsg];
  // Custom Request
  const customRequest = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params: msgParams,
  };
  try {
    // send message
    const result = await connector.sendCustomRequest(customRequest);
    // result is a hex encoded signature
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // verify signature
    const valid = await verifySignature(message, signature, pubKeyB64);
    return { method, valid, result, message };
  } catch (error) {
    return { method, valid: false, error };
  }
};
