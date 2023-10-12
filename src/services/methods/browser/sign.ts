import { convertUtf8ToHex } from '@walletconnect/utils';
import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { verifySignature } from '../../../helpers';
import { BrowserSignFunction, SignRequestBrowser } from '../../../types';
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
}: BrowserSignFunction) => {
  // TODO: Don't use any
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();

  const method = PROVENANCE_METHODS.SIGN;
  // If needed, convert the message to hex before adding to request params
  const hexMessage = isHex ? message : convertUtf8ToHex(message, true);

  // Build out full request object to send to browser wallet
  const request: SignRequestBrowser = {
    address,
    message: hexMessage,

    browserEvent: BROWSER_EVENTS.BASIC,
    date: Date.now(),
    description,
    id: customId || `${rngNum()}`, // TODO: Should this just be customId?
    method,
    requestFavicon,
    requestName,
    requestOrigin,
  };

  // Send a message to the wallet containing the request and wait for a response
  const { error, result } = await wallet.browserEventAction(request, method);
  console.log('wcjs | signMessage.ts | response: ', { error, result });
  if (error) return { valid: false, error };
  if (!result) return { error: { message: 'Result missing', code: 0}, valid: false};
  // result is a hex encoded signature
  const signature = Uint8Array.from(Buffer.from(result.signature, 'hex'));
  // verify signature
  const valid = await verifySignature(hexMessage, signature, pubKeyB64);

  return { valid, result: { signature }, request };
};
