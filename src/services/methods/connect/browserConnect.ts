import { BROWSER_EVENTS, PROVENANCE_METHODS } from '../../../consts';
import { sendWalletMessage } from '../../../helpers';
import {
  ConnectMethod,
  ConnectMethodResults,
  ConnectWalletResponseBrowser,
} from '../../../types';
import { getPageData } from '../../../utils';

// TODO: Not sure if using ConnectMethod to type browserConnect is right...
export const browserConnect = async ({
  connectionDuration,
  jwtDuration,
  groupAddress,
  individualAddress,
  prohibitGroups,
  walletId,
}: ConnectMethod): Promise<ConnectWalletResponseBrowser> => {
  const {
    favicon: requestFavicon,
    origin: requestOrigin,
    title: requestName,
  } = getPageData();
  // TODO: Need sendWalletMessage result to be based on... method
  const response: ConnectWalletResponseBrowser = await sendWalletMessage({
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

  const { accounts } = response.result;
  const { address, attributes, jwt, publicKey, walletInfo, representedGroupPolicy } =
    accounts;
  const { coin, id, name } = walletInfo;

  const result: ConnectMethodResults = {
    ...(response.error && { error: response.error }),
    state: {
      connection: { status: 'connected', type: 'browser', walletId },
      wallet: {
        address,
        attributes,
        signedJWT: jwt,
        publicKey,
        representedGroupPolicy,
        coin,
        id,
        name,
      },
    },
  };
  return result;
};
