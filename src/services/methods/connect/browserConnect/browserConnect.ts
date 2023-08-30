import { WALLET_LIST } from '../../../../consts';
import { ConnectMethodResults, WalletId } from '../../../../types';
import { getPageData, walletConnectAccountInfo } from '../../../../utils';

// TODO: Move this to /types
interface BrowserConnectParams {
  duration?: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtExpiration?: number;
  prohibitGroups?: boolean;
  walletAppId: WalletId;
}

// TODO: Move this into /consts
const BROWSER_MESSAGE_WALLETS = 'figure_extension';

export const browserConnect = async ({
  duration,
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
  if (
    BROWSER_MESSAGE_WALLETS.includes(walletAppId) &&
    knownWalletApp &&
    knownWalletApp.eventAction
  ) {
    // Pull page specific information out of the dApp to share with the wallet
    const {
      origin: requestOrigin,
      favicon: requestFavicon,
      title: requestName,
    } = getPageData();
    // Result will either have data or an error
    let result;
    // Wrapping event action with a try/catch to catch upstream rejects
    try {
      console.log('wcjs | browserConnect | eventAction wait');
      result = await knownWalletApp.eventAction({
        event: 'basic_event',
        request: {
          ...(individualAddress && { individualAddress }),
          ...(groupAddress && { groupAddress }),
          ...(duration && { duration }),
          ...(jwtExpiration && { jwtExpiration }),
          ...(prohibitGroups && { prohibitGroups }),
          ...(requestOrigin && { requestOrigin }),
          ...(requestName && { requestName }),
          ...(requestFavicon.length && { requestFavicon }),
          method: 'connect',
        },
      });
    } catch (error) {
      result = { error };
    }
    console.log('wcjs | browserConnect | eventAction result: ', result);
    // At this point, result will either have account data or an error
    const { accounts, error } = result;
    const {
      address,
      attributes,
      jwt: signedJWT,
      publicKey,
      representedGroupPolicy,
      walletInfo,
    } = walletConnectAccountInfo(accounts);
    // We are now connected, update the walletConnectService state and broadcast the connection event to listening dApps
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
    // We don't have a valid wallet for a browser connection
    else {
      // Reset the walletConnectService state
      results.state = 'resetState';
    }
  }
  return results;
};
