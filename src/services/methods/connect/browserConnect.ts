import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { sendWalletMessage } from '../../../helpers';
import { ConnectMethod, ConnectMethodResults } from '../../../types';
import { getPageData } from '../../../utils';

export const browserConnect = async ({
  connectionDuration,
  jwtDuration,
  groupAddress,
  individualAddress,
  prohibitGroups,
  walletId,
}: ConnectMethod): Promise<ConnectMethodResults> => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  const response = await sendWalletMessage({
    request: {
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
    },
    walletId,
  });
  console.log('wcjs | browserConnect | response: ', response);
  // TODO: This should NOT be an any...result should be typed
  // const {} = response.result;

  const result: ConnectMethodResults = {
    error: response.error,
    state: {
      connection: { status: 'connected', type: 'browser', walletId },
      wallet: { address: response.result },
    },
  };
  return result;
};
