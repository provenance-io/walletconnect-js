export { };
  import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
  import type {
    BrowserSendTx,
    SendTxRequestBrowser
  } from '../../../types';
  import { getPageData, rngNum } from '../../../utils';

export const sendTx = async ({
  description = 'Send Transaction',
  customId,
  wallet,
  tx: txB64,
  ...txData
}: BrowserSendTx) => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  const method = PROVENANCE_METHODS.SEND;
  // Ensure the tx is an array
  const txB64Array = Array.isArray(txB64) ? txB64 : [txB64];
  const request: SendTxRequestBrowser = {
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
  const {result, error} = await wallet.browserEventAction(request, method);
  console.log('wcjs | sendTx | response: ', {result, error});

  if (error) return { error };
  if (!result) return { error: { message: 'Result missing', code: 0} };
  // When the response has a code 0, something is wrong
  if (result.txResponse.code === 0) return { error: { message: 'Tx Failed', code: 0} };

  return { result };
};
