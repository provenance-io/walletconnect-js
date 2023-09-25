import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { BrowserWallet, ConnectMethodServiceFunctionResults } from '../../../types';
import { getPageData } from '../../../utils';

interface Connect {
  connectionDuration: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration: number;
  prohibitGroups: boolean;
  wallet: BrowserWallet;
}

export const connect = async ({
  connectionDuration,
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
  // Build out full request object to send to browser wallet
  const request = {
    method: PROVENANCE_METHODS.CONNECT,
    browserEvent: BROWSER_EVENTS.BASIC,
    connectionDuration,
    groupAddress,
    individualAddress,
    jwtDuration,
    prohibitGroups,
    requestFavicon,
    requestOrigin,
    requestName,
  };
  // Wait for wallet to send back a response
  const response = await wallet.browserEventAction(
    request,
    PROVENANCE_METHODS.CONNECT
  );
  console.log('wcjs | connect.ts | connectResults: ', response);
  // Use the response to pull out data for wcjs store/dApp response
  const { wallet: walletResponse, error } = response;
  if (error) return { error, resetState: true };
  // Calculate and set the new exp, est times
  const est = Date.now();
  const exp = connectionDuration + est;

  const result: ConnectMethodServiceFunctionResults = {
    state: {
      connection: {
        status: 'connected',
        connectionDuration,
        jwtDuration,
        est,
        exp,
        walletId: wallet.id,
      },
      wallet: walletResponse,
    },
  };

  return result;
};
