import { convertUtf8ToHex } from '@walletconnect/utils';
import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { verifySignature } from '../../../helpers';
import type {
  BrowserSign,
  BrowserSignRequest,
  BrowserSignReturn,
} from '../../../types';
import { getPageData, rngNum } from '../../../utils';

// TODO: Get proper Promise response shape...
export const sign = async ({
  address,
  description = 'Sign Message',
  customId,
  message,
  isHex = true,
  publicKey: pubKeyB64,
  wallet,
}: BrowserSign): Promise<BrowserSignReturn> => {
  // TODO: Don't use any
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();

  const method = PROVENANCE_METHODS.SIGN;
  // Build out full request object to send to browser wallet
  const request: BrowserSignRequest = {
    method,
    browserEvent: BROWSER_EVENTS.BASIC,
    id: customId || `${rngNum()}`, // TODO: Should this just be customId?
    description,
    address,
    date: Date.now(),
    message,
    requestFavicon,
    requestOrigin,
    requestName,
  };

  // If needed, convert the message to hex before adding to request params
  const hexMessage = isHex ? message : convertUtf8ToHex(message, true);
  request.message = hexMessage;
  // Send a message to the wallet containing the request and wait for a response
  const response = await wallet.browserEventAction(request, method);
  console.log('wcjs | signMessage.ts | response: ', response);
  if (response.error) return { valid: false, error: response.error };
  // result is a hex encoded signature
  const signature = Uint8Array.from(Buffer.from(response, 'hex'));
  // verify signature
  const valid = await verifySignature(hexMessage, signature, pubKeyB64);

  return { valid, result: { signature: response }, request };
};
