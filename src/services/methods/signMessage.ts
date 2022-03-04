import { convertUtf8ToHex } from "@walletconnect/utils";
import { verifySignature } from '../../helpers';
import { State } from '../walletConnectService';

export const signMessage = async (state: State, message: string) => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64 } = state;
  const method = 'provenance_sign';
  const description = 'Sign Message';

  if (!connector) return { method, valid, error: 'No wallet connected' };
  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  // eth_sign params
  const metadata = JSON.stringify({
    description,
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
    valid = await verifySignature(message, signature, pubKeyB64);
    return { method, valid, result, message };
  } catch (error) {
    return { method, valid, error };
  }
};