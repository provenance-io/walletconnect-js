export {};
import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import type {
  BrowserSendTx,
  BrowserSendTxRequest,
  BrowserSendTxReturn,
} from '../../../types';
import { getPageData, rngNum } from '../../../utils';

export const sendTx = async ({
  description = 'Send Transaction',
  customId,
  wallet,
  tx: txB64,
  ...txData
}: BrowserSendTx): Promise<BrowserSendTxReturn> => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  const method = PROVENANCE_METHODS.SEND;
  // Ensure the tx is an array
  const txB64Array = Array.isArray(txB64) ? txB64 : [txB64];
  const request: BrowserSendTxRequest = {
    browserEvent: BROWSER_EVENTS.BASIC,
    date: Date.now(),
    description,
    id: customId || `${rngNum()}`,
    method,
    requestFavicon,
    requestName,
    requestOrigin,
    tx: txB64Array,
    ...txData,
  };

  // Send a message to the wallet containing the request and wait for a response
  // TODO: Need a type on this response
  const response = await wallet.browserEventAction(request, method);
  console.log('wcjs | sendTx | response: ', response);

  if (response.error) return { valid: false, error: response.error };
  // When the response has a code 0, something is wrong
  const badResponseCode = response?.result?.txResponse?.code === '0';
  const noResponse = !response;
  const errorResponse = response.error;
  const hasError = badResponseCode || noResponse || errorResponse;

  if (hasError) {
    const error = badResponseCode
      ? { message: 'Transaction Failed', code: 0 }
      : noResponse
      ? { message: 'Transaction Failed', code: 0 }
      : errorResponse; // Error responses from wallet will be objects
    return {
      valid: false,
      error,
    };
  }

  return { valid: true, result: { ...response }, request };
};
