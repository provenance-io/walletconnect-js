import { convertUtf8ToHex } from "@walletconnect/utils";
import { verifySignature } from '../../helpers';
import { State } from '../walletConnectService';

export const signMessage = async (state: State, message: string) => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64 } = state;
  const method = 'provenance_sign';
  const description = 'Sign Message';
  const metadata = JSON.stringify({
    description,
    address,
  });
  // Custom Request
  const request = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params: [metadata],
  };

  if (!connector) return { valid, data: message, request, error: 'No wallet connected' };
  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  try {
    // send message
    const result = await connector.sendCustomRequest(request);
    // result is a hex encoded signature
    const signature = Uint8Array.from(Buffer.from(result, 'hex'));
    // verify signature
    valid = await verifySignature(message, signature, pubKeyB64);
    return { valid, result, data: message, request };
  } catch (error) {
    return { valid, error, data: message, request };
  }
};
