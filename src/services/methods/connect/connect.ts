import { BROWSER_MESSAGE_WALLETS } from '../../../consts';
import { ConnectMethodFunction, ConnectMethodResults } from '../../../types';
import { browserConnect } from './browserConnect';
import { mobileConnect } from './mobileConnect';

// Init will determine if we want to send a walletconnect event or a browser message event based on the connected/intended wallet type/id

// TEMP: Write up on what we need to happen for each "init" (It's a mess right now...)
/*
  Init Method Params (all optional): bridge, duration, individualAddress, groupAddress, prohibitGroups, jwtExpiration, walletAppId
    - Will refer to these params as INIT_PARAMS below
  Goal:
    - Make a new or resume an existing connection to a dApp.
    - DApp should be informed about the new connection completing or failing.
    - WalletConnectService state should be updated to reflect the current connection/wallet status.
    - Init method will be fired whenever the dApp expects a connection loaded, reloaded, on button click, etc.
    - DApp may pass connection requirements/information into init method restricting what wallets may connect
    - Init method needs to be async letting the dApp wait for the connection to be established/rejected
      - Note: Should include <qrCodeModal> in this wait time while it's open (new feature)

  Init method is called:
    - New promise
    - If walletConnectService status is already 'connected' reject w/error: 'already connected'
    - Set walletConnectService status to 'pending' as well as pendingMethod to 'init'
    - Based on the walletAppId passed in (if any):
      - No walletId passed in, use qrCodeModal:
        - New promise (is this possible?)
        - Render <QrCodeModal> component with two options (large images):
          - "Scan QR Code"
            - On click, runs await walletConnectInit() (Mobile Wallet Init)
          - "Use Browser Wallet"
            - On click, runs await browserWalletInit() (Browser Wallet Init)

      - Mobile Wallet Init (walletConnectInit):
        - New promise

      - Browser Wallet Init (browserWalletInit):
        - New promise
        - Gather all information about dApp requesting connection:
          - Page origin, Page favicon, Page title (Will refer as PAGE_INFO)
          - Await wallet eventAction to browser wallet with:
            // TODO: Standardize event / method names for wcjs and browser wallets
            - {request: {...INIT_PARAMS, ...PAGE_INFO, method: 'init' }, event: 'basic_event'}
          - Using response (if no error), update walletConnectService state values:
            - connectionEST, connectionEXP, status, walletAppId, address, publicKey, signedJWT, walletInfo, attributes, representedGroupPolicy
          - If response has an error, reset current walletConnectService state, reject with error
          - Broadcast to any listening dApps using WINDOW_MESSAGES that a connection was initialized
          - Data broadcast: {result: connectionEST, connectionEXP, connectionType}
            - Should be be sending different data? What would dApps want?
            - Note: dApps should be using promises and not window events, maybe depricate `broadcast`?
          - Resolve with same data we broadcast the connection event

*/
export const connect = async ({
  bridge,
  connectionDuration,
  jwtDuration,
  groupAddress,
  individualAddress,
  prohibitGroups,
  walletId,
}: ConnectMethodFunction): Promise<ConnectMethodResults> => {
  let connectResults: ConnectMethodResults = {};
  // We are given a specific wallet we want to open, determine if it's going to use walletconnect or not
  if (walletId && BROWSER_MESSAGE_WALLETS.includes(walletId)) {
    connectResults = await browserConnect({
      connectionDuration,
      groupAddress,
      individualAddress,
      jwtDuration,
      prohibitGroups,
      walletId,
    });
  }
  // We either don't have a requested wallet or we're not using the browser wallet messaging
  else {
    connectResults = await mobileConnect({
      bridge,
      connectionDuration,
      groupAddress,
      individualAddress,
      jwtDuration,
      prohibitGroups,
      walletId,
    });
  }
  // If we are connected, calculate the new connection est/exp times
  if (connectResults.state?.connection?.status === 'connected') {
    // TODO: Check to see if it's valid, if it's already expired (session resume), kill the connection
    // Calculate and set the new exp, est times
    const est = Date.now();
    const exp = connectionDuration + est;
    connectResults.state.connection.connectionDuration = connectionDuration;
    connectResults.state.connection.jwtDuration = jwtDuration;
    connectResults.state.connection.est = est;
    connectResults.state.connection.exp = exp;
  }

  console.log('wcjs | connect.ts | connectResults: ', connectResults);

  return connectResults;
};
