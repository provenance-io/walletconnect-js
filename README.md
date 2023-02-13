# Provenance.io WalletConnect-JS

Library to interface with Provenance Wallet using WalletConnect.

[Provenance] is a distributed, proof of stake blockchain designed for the financial services industry.

For more information about [Provenance Inc](https://provenance.io) visit https://provenance.io

## Version 3.x.x breaking changes:
- `walletConnectService`
  - Renamed `signMessage` to `signHexMessage`
  - Results of methods (other than `connect` can now all use `await`)
    - eg: `const result = await walletConnectService.signHexMessage('test');` 
  - Removed `generateAutoConnectUrl` method.  Will revisit at a later time
  - Removed `setState`, `resetState`, `removeAllListeners` and `on` methods
    - `addListener` should be use in place of `on`
    - `removeListener('all')` should be used in place of `removeAllListeners`
- `walletConnectState` shape changed
  - `connected` is now `status` which can be `"connected"`, `"disconnected"`, or `"pending"`
  - `walletApp` is now `walletAppId`
  - `loading` is now `pendingMethod`
  - QRCode values now moved into `modal` state object
  - Removed `account`, `figureConnected`, `newAccount`, and `connector` values
- `QRCodeModal` wallet changes
  - Moved Provenance Blockchain wallets into `dev`
  - Added Figure Mobile wallets as responsive mobile options
  - Package now transpiles optional chaining
- WalletConnectContext
  - Optional `connectionRedirect` string url value will auto-redirect users when disconnected
  - Optional `service` lets dApps manually pass in their own instance of `walletConnectService`
- WINDOW_MESSAGES
  - Renamed `SIGN_MESSAGE` events to `SIGN_HEX_MESSAGE`

## Table of Contents

1. [Installation](#Installation)
2. [WalletConnectContextProvider](#WalletConnectContextProvider)
3. [useWalletConnect](#useWalletConnect)
4. [walletConnectState](#walletConnectState)
5. [walletConnectService](#walletConnectService)
   - [connect](#connect)
   - [disconnect](#disconnect)
   - [resetConnectionTimeout](#resetConnectionTimeout)
   - [signJWT](#signJWT)
   - [sendMessage](#sendMessage)
   - [signHexMessage](#signHexMessage)
6. [QRCodeModal](#QRCodeModal)
7. [Window messages](#Window-Messages)
8. [Examples](#Examples,-Setup-Configurations,-and-Alternate-imports)
10. [Status](#Status)

## Installation

```bash
npm install @provenanceio/walletconnect-js --save
```

Exported items:

```js
import {
  // Constants
  WALLET_LIST,
  WINDOW_MESSAGES,
  CONNECTOR_EVENTS,
  CONNECTION_TYPES,
  // Services/Providers
  useWalletConnect,
  useWalletConnectService,
  WalletConnectContextProvider,
  WalletConnectService,
  // Components
  QRCodeModal
  // Types
  BroadcastResult,
  ProvenanceMethod,
  WalletConnectServiceStatus,
  ConnectMethod,
} from "@provenanceio/walletconnect-js";
```

## WalletConnectContextProvider

React context provider which provides all children components with state and hooks
Optional Params:
  - `service`: Manual instance of `walletConnectService` to use/reference
  - `connectionRedirect`: Auto-redirect string url to redirect user when `status` is `disconnected`
- React.js example:
  ```js
  // index.js
  ...
  ReactDOM.render(
    <WalletConnectContextProvider>
      <App />
    </WalletConnectContextProvider>,
    document.getElementById('root')
  );
  ```

## useWalletConnect

React hook which containing `walletConnectService` and `walletConnectState`

### walletConnectState

Holds current walletconnect-js state values
  ```js
  initialState: {
    address: '', // Wallet address [string]
    bridge: 'wss://figure.tech/service-wallet-connect-bridge/ws/external', // WalletConnect bridge used for connection [string]
    status: 'disconnected', // connection status connected ['connected', 'pending', 'disconnected]
    connectionEST: null, // WalletConnect expires at time [number]
    connectionEXP: null, // WalletConnect initialized at time [number]
    connectionTimeout: 1800, // Default timeout duration (seconds)
    modal: { // QRCodeModal values
      showModal: false, // Should the QR modal be open [bool]
      QRCodeUrl: '', // QRCode url contained within image [string]
      QRCode: '', // QRCode image data to connect to WalletConnect bridge [string]
      isMobile: false, // Is the connected browser a mobile device [bool]
    },
    peer: {}, // Connected wallet info [object]
    pendingMethod: '', // Are any methods currently pending [string]
    publicKey: '', // Wallet public key (base64url encoded)
    signedJWT: '', // Signed JWT token [string]
    walletAppId: '', // Type of wallet [string]
    walletInfo: { // Information about the currently connected wallet account
      coin: '', // [string]
      id: '', // [string]
      name: '', // [string]
    },
    representedGroupPolicy: null, //Present when the wallet holder is acting on behalf of a group
  }
  ```
### walletConnectService

Used to call walletconnect-js methods

- #### connect

  Connect a supported wallet

  ```js
  walletConnectService.connect(options);
  // WINDOW_MESSAGE: CONNECTED
  ```

  | Param  | Type   | Required | Default                | Example      | Info                                    |
  | ------ | ------ | -------- | ---------------------- | ------------ | --------------------------------------- |
  | bridge | string | no       | `"wss://figure.tech/service-wallet-connect-bridge/ws/external"` | `"wss://custom.bridge"` | Custom bridge to connect into |
  | duration | number | no       | `1800` | `3600` | Custom connection timeout in seconds |
  | noPopup | boolean | no       | false | true | Should the QRCodeModal popup automatically on connect call |
  | address | string | no       | `''` | `tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh` | Required address for dApp connection |
  | prohibitGroups | boolean | no       | `false` | `true` | Prohibit group accounts from connecting to this dApp |
  | jwtExpiration | number | no       | `''` | `3600` | Time from now in seconds to expire new JWT returned |

- #### disconnect

  Disconnect current session

  ```js
  walletConnectService.disconnect();
  // WINDOW_MESSAGE: DISCONNECT
  ```

- #### resetConnectionTimeout

  Change the amount of connection time remaining for the currenct walletconnect session
  _Note: This feature is currently only available in extension wallets_
  ```js
  walletConnectService.resetConnectionTimeout(connectionTimeout);
  ```
  | Param   | Type   | Required | Default | Example               | Info                   |
  | ------- | ------ | -------- | ------- | --------------------- | ---------------------- |
  | connectionTimeout | number | no      | 1800       | 3600 | Seconds to extend current session |

- #### signJWT

  Prompt user to sign a generated JWT (async)

  ```js
  walletConnectService.signJWT(expire);
  // WINDOW_MESSAGES: SIGN_JWT_COMPLETE, SIGN_JWT_FAILED
  ```

  | Param  | Type   | Required | Default                | Example      | Info                                    |
  | ------ | ------ | -------- | ---------------------- | ------------ | --------------------------------------- |
  | expire | number | no       | 24 hours (Date.now() + 86400) | `1647020269` | Custom expiration date (ms) of JWT |

- #### sendMessage

  Submit custom base64 encoded message (async)

  ```js
  walletConnectService.sendMessage(options);
  // WINDOW_MESSAGES: SEND_MESSAGE_COMPLETE, SEND_MESSAGE_FAILED
  ```

  | Param       | Type           | Required | Default                                                           | Example                                      | Info                                                |
  | ----------- | -------------- | -------- | ----------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
  | message     | string / array | yes      | -                                                                 | `'CiwvcHJvdmVuYW5jZS5tZX...'`                | B64 encoded Message(s) to pass to wallet            |
  | description | string         | no       | `'Send Message'`                                                 | `'My Special Message'`                         | Prompt title on mobile wallet                       |
  | method      | string         | no       | `'provenance_sendTransaction'`                                    | `'provenance_sendTransaction'`               | Message method                                      |
  | gasPrice    | object         | no       | `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` | `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` | Optional gasPrice object, defaults to Figure values |
  | feeGranter    | string         | no       | - | `'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh'` | Specify a fee granter address |
  | feePayer    | string         | no       | - | `'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh'` | Specify a fee payer address |
  | memo    | string         | no       | - | `'My special memo'` | Specify a tx memo |
  | timeoutHeight    | number         | no       | - | `3` | Specify a tx timeoutHeight |
  | extensionOptions    | any[]         | no       | - | `['CiwvcHJvdmVuYW5jZS5tZX...']` | Specify tx extensionOptions |
  | nonCriticalExtensionOptions    | any[]         | no       | - | `['CiwvcHJvdmVuYW5jZS5tZX...']` | Specify tx nonCriticalExtensionOptions |

- #### signHexMessage
  Sign a custom hex string message (async)
  ```js
  walletConnectService.signHexMessage(message);
  // WINDOW_MESSAGES: SIGN_HEX_MESSAGE_COMPLETE, SIGN_HEX_MESSAGE_FAILED
  ```
  | Param   | Type   | Required | Default | Example               | Info                   |
  | ------- | ------ | -------- | ------- | --------------------- | ---------------------- |
  | message | string | yes      | -       | `'My Custom Message'` | Hex string message to send |

## QRCodeModal

Optional React.js component which creates a popup connection interface.

- Params:
  - `walletConnectService`: Service pulled out of `useWalletConnect()` hook (Required)
  - `devWallets`: Array of allowed dev wallets to connect into. (Optional)
  - `hideWallets`: Array of prod wallets to hide from user. (Optional)
  - `className`: CSS class to customize the styling (Optional)
  - `title`: Title displayed on top of the modal (Optional)

- Usage: _(See example apps for in-code usage)_
  - Import the component in the same page as you call `walletConnectService.connect()`
  
- Note:
  - `src/consts/walletList.ts` contains a list of available `walletsAppID`s 
  - This modal is built with React.js and will only work within a react project. If you are not using React.js look through the `examples` folder to see how to initiate the connection without this QRCodeModal.

## Window Messages

Each method will return a window message indicating whether it failed or was completed as well as the result.

_Note A: You can use `await` for most `walletConnectService` methods instead._
_Note B: All of these are based off Node.js Event Emitters, read more on them here: [Node.js Event Emitters](https://nodejs.org/api/events.html#event-newlistener)_

Window Messages:
 `CONNECTED`, `DISCONNECT`, `SEND_MESSAGE_COMPLETE`, `SEND_MESSAGE_FAILED`, `SIGN_JWT_COMPLETE`, `SIGN_JWT_FAILED`, `SIGN_HEX_MESSAGE_COMPLETE`, `SIGN_HEX_MESSAGE_FAILED`

_(See example apps for more detailed usage)_

## Examples, Setup Configurations, and Alternate imports

This package comes bundled with a full demos that you can run locally to test out the various features of `walletconnect-js`.
To see how to initiate and run the different examples, look through the [README.md](./examples/README.md)

- Non React Setup
  - See examples folder for demo apps
- Using a CDN Import
  - You can find this package on `https://unpkg.com/`: - Note: Change the version in the url as needed: `https://unpkg.com/@provenanceio/walletconnect-js@2.0.0/umd/walletconnect-js.min.js`

## Status

[![Latest Release][release-badge]][release-latest]
[![Apache 2.0 License][license-badge]][license-url]
[![LOC][loc-badge]][loc-report]

[license-badge]: https://img.shields.io/github/license/provenance-io/walletconnect-js.svg
[license-url]: https://github.com/provenance-io/walletconnect-js/blob/main/LICENSE
[release-badge]: https://img.shields.io/github/tag/provenance-io/walletconnect-js.svg
[release-latest]: https://github.com/provenance-io/walletconnect-js/releases/latest
[loc-badge]: https://tokei.rs/b1/github/provenance-io/walletconnect-js
[loc-report]: https://github.com/provenance-io/walletconnect-js
[lint-badge]: https://github.com/provenance-io/walletconnect-js/workflows/Lint/badge.svg
[provenance]: https://provenance.io/#overview

This application is under heavy development. The upcoming public blockchain is the evolution of the private Provenance network blockchain started in 2018.
Current development is being supported by [Figure Technologies](https://figure.com).

[Back to top](#Provenance.io-WalletConnect-JS)


