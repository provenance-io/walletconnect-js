import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet, ConnectMethodServiceFunctionResults, ConnectRequestBrowser } from '../../../types';
import { getPageData, rngNum } from '../../../utils';

interface Connect {
  connectionDuration: number;
  customId?: string;
  description?: string;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration: number;
  prohibitGroups: boolean;
  wallet: BrowserWallet;
}

export const connect = async ({
  connectionDuration,
  customId,
  description = 'Send Wallet Action',
  groupAddress,
  individualAddress,
  jwtDuration,
  prohibitGroups,
  wallet,
}: Connect): Promise<ConnectMethodServiceFunctionResults> => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  const method = PROVENANCE_METHODS.CONNECT;
  // Build out full request object to send to browser wallet
  const request: ConnectRequestBrowser = {
    connectionDuration,
    groupAddress,
    individualAddress,
    jwtDuration,
    prohibitGroups,

    browserEvent: BROWSER_EVENTS.BASIC,
    date: Date.now(),
    description,
    id: customId || `${rngNum()}`,
    method,
    requestFavicon,
    requestName,
    requestOrigin,
  };
  // Wait for wallet to send back a response
  const { result, error } = await wallet.browserEventAction(request, method);
  console.log('wcjs | connect.ts | connectResults: ', { result, error });
  if (error) return { error, resetState: true };
  if (!result) return { error: { message: 'Missing result', code: 0 }, resetState: true };

  // Calculate and set the new exp, est times
  const est = Date.now();
  const exp = connectionDuration + est;

  const methodResult: ConnectMethodServiceFunctionResults = {
    state: {
      connection: {
        status: 'connected',
        connectionDuration,
        jwtDuration,
        est,
        exp,
        walletId: wallet.id,
      },
      wallet: result.wallet,
    },
  };

  return methodResult;
};
