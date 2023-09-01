import { WALLET_LIST } from '../../../../consts';
import {
  BrowserConnectParams,
  ConnectMethodResults,
  WalletConnectResponse,
} from '../../../../types';
import { getPageData, walletConnectAccountInfo } from '../../../../utils';

export const browserConnect = async ({
  groupAddress,
  individualAddress,
  jwtExpiration,
  prohibitGroups,
  walletAppId,
}: BrowserConnectParams) => {
  const results: ConnectMethodResults = {};
  // Find the target wallet based on the app id
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);
  // Must have a wallet with an eventAction to continue
  if (knownWalletApp && knownWalletApp.eventAction) {
    // Pull page specific information out of the dApp to share with the wallet
    const {
      origin: requestOrigin,
      favicon: requestFavicon,
      title: requestName,
    } = getPageData();
    // walletResponse will either have data or an error
    let walletResponse: WalletConnectResponse;
    // Wrapping event action with a try/catch for upstream rejects
    try {
      console.log('wcjs | browserConnect | eventAction wait');
      walletResponse = await knownWalletApp.eventAction({
        event: 'basic_event',
        request: {
          ...(individualAddress && { individualAddress }),
          ...(groupAddress && { groupAddress }),
          ...(jwtExpiration && { jwtExpiration }),
          ...(prohibitGroups && { prohibitGroups }),
          ...(requestOrigin && { requestOrigin }),
          ...(requestName && { requestName }),
          ...(requestFavicon.length && { requestFavicon }),
          method: 'connect',
        },
      });
    } catch (error) {
      walletResponse = { error: `${error}` };
    }
    console.log(
      'wcjs | browserConnect | eventAction walletResponse: ',
      walletResponse
    );
    // At this point, result will either have account data or an error
    const { accounts, error } = walletResponse;
    const {
      address,
      attributes,
      jwt: signedJWT,
      publicKey,
      representedGroupPolicy,
      walletInfo,
    } = walletConnectAccountInfo(accounts);
    // We are now connected: update wcs state
    if (!error) {
      const { coin, id, name } = walletInfo;
      results.state = {
        connection: { status: 'connected', walletAppId },
        wallet: {
          address,
          publicKey,
          signedJWT,
          coin,
          id,
          name,
          ...(attributes && { attributes }),
          ...(representedGroupPolicy && { representedGroupPolicy }),
        },
      };
    }
    // We have an error (likely just rejected connection by user) - set status to disconnected
    else {
      results.resetState = true;
      results.error = error;
    }
  }
  // We don't have a valid wallet for a browser connection
  else {
    // Reset the walletConnectService state
    results.resetState = true;
  }

  return results;
};
