import { PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet } from '../../../types';
import { rngNum } from '../../utils';

interface SendWalletAction {
  data: any;
  wallet: BrowserWallet;
}

export const sendWalletAction = async ({
  wallet,
  data,
}: SendWalletAction): Promise<any> => {
  const {
    description = 'Send Wallet Action',
    method = PROVENANCE_METHODS.ACTION,
    action,
    payload,
  } = data;
  const metadata = JSON.stringify({
    description,
    action,
    payload,
    date: Date.now(),
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  // Send a message to the wallet containing the request and wait for a response
  const response = await wallet.browserEventAction(request, request);

  return { valid: !!response && !response.error, ...response };
};
