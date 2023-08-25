import { CONNECTION_TYPES, WALLET_LIST, WINDOW_MESSAGES } from '../../../../consts';
import {
  BroadcastEventData,
  BroadcastEventName,
  ConnectMethodResults,
  WCSSetState,
  WalletId,
} from '../../../../types';
import { getPageData, walletConnectAccountInfo } from '../../../../utils';

interface BrowserConnectParams {
  broadcast: (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData[BroadcastEventName]
  ) => void;
  connectionTimeout: number;
  duration?: number;
  groupAddress?: string;
  individualAddress?: string;
  jwtExpiration?: number;
  prohibitGroups?: boolean;
  resetState: () => void;
  setState: WCSSetState;
  walletAppId: WalletId;
}

// TODO: Move this into /consts
const BROWSER_MESSAGE_WALLETS = 'figure_extension';

export const browserConnect = async ({
  broadcast: broadcastEvent,
  connectionTimeout,
  duration,
  groupAddress,
  individualAddress,
  jwtExpiration,
  prohibitGroups,
  resetState,
  setState,
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
      const connectionEST = Date.now();
      const connectionEXP = connectionTimeout + connectionEST;
      setState({
        connectionEST,
        connectionEXP,
        status: 'connected',
        walletAppId,
        address,
        publicKey,
        signedJWT,
        walletInfo,
        ...(attributes && { attributes }),
        ...(representedGroupPolicy && { representedGroupPolicy }),
      });
      broadcastEvent(WINDOW_MESSAGES.CONNECTED, {
        result: {
          connectionEST,
          connectionEXP,
          connectionType: CONNECTION_TYPES.new_session,
        },
      });
    }
    // We don't have a valid wallet for a browser connection
    else {
      // Reset the walletConnectService state
      resetState();
      broadcastEvent(WINDOW_MESSAGES.DISCONNECT, {
        result: 'Wallet does not exist',
      });
    }
  }
  return results;
};
