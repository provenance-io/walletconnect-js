import { PROVENANCE_METHODS } from '../../consts';
import { sendWalletMessage } from '../../helpers';
import type {
  RemovePendingMethodResponse,
  SendWalletActionMethod,
  SwitchGroupResponse,
  WalletConnectClientType,
  WalletId,
} from '../../types';
import { rngNum } from '../../utils';

interface SendWalletAction {
  connector?: WalletConnectClientType;
  data: SendWalletActionMethod;
  walletId: WalletId;
}

export const sendWalletAction = async ({
  connector,
  walletId,
  data,
}: SendWalletAction): Promise<SwitchGroupResponse | RemovePendingMethodResponse> => {
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
  const response = await sendWalletMessage({ request, walletId, connector });

  return { valid: !!response && !response.error, ...response };
};
