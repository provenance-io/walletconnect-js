import { convertUtf8ToHex } from "@walletconnect/utils";
import { verifySignature } from '../../helpers';
import { State } from '../walletConnectService';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';

export const signMessage = async (state: State, message: string) => {
  let valid = false;
  const { connector, address, publicKey: pubKeyB64, walletApp, customExtId } = state;
  const method = 'provenance_sign';
  const description = 'Sign Message';
  const metadata = JSON.stringify({
    description,
    address,
    date: Date.now(),
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: "2.0",
    method,
    params: [metadata],
  };
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find(wallet => wallet.id === walletApp);
  if (!connector) return { valid, data: message, request, error: 'No wallet connected' };
  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT , customExtId };
      knownWalletApp.eventAction(eventData);
    }
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
