# Provenance.io WalletConnect-JS

Library to interface with Provenance Wallet using WalletConnect.

[Provenance] is a distributed, proof of stake blockchain designed for the financial services industry.

For more information about [Provenance Inc](https://provenance.io) visit https://provenance.io

## Table of Contents

1. [Installation](#Installation)
2. [Window messages](#Window-Messages)
3. [WalletConnectContextProvider](#WalletConnectContextProvider)
4. [QRCodeModal](#QRCodeModal)
5. [useWalletConnect](#useWalletConnect)
6. [walletConnectService](#walletConnectService)
   - [connect](#connect)
   - [disconnect](#disconnect)
   - [generateAutoConnectUrl](#generateAutoConnectUrl)
   - [resetConnectionTimeout](#resetConnectionTimeout)
   - [signJWT](#signJWT)
   - [sendMessage](#sendMessage)
   - [signMessage](#signMessage)
7. [walletConnectState](#walletConnectState)
8. [Web App](#Web-App)
9. [Non React Setup](#Non-React-Setup)
10. [WalletConnect-js Status](#Status)

## Installation

Import the dependency

```bash
npm install @provenanceio/walletconnect-js --save
```

Importable items:

```js
import {
  // Constants
  WALLET_LIST,
  WINDOW_MESSAGES,
  // Services/Providers
  useWalletConnect,
  useWalletConnectService,
  WalletConnectContextProvider,
  WalletConnectService,
  // Components
  QRCodeModal
  // Types
  BroadcastResult,
  ProvenanceMethod
} from "@provenanceio/walletconnect-js";
```

## Window Messages

Each method will return a window message indicating whether it failed or was completed as well as the result

_Note A: See `walletConnectService` for all `WINDOW_MESSAGES` based on method._
_Note B: All of these are based off Node.js Event Emitters, read more on them here: [Node.js Event Emitters](https://nodejs.org/api/events.html#event-newlistener)_

List of WINDOW_MESSAGES:
```js
  export const WINDOW_MESSAGES = {
  // WalletConnect Connected
  CONNECTED: 'FWC_CONNECTED',
  // WalletConnect Disconnect
  DISCONNECT: 'FWC_DISCONNECT',
  // Send Message
  SEND_MESSAGE_COMPLETE: 'SEND_MESSAGE_COMPLETE',
  SEND_MESSAGE_FAILED: 'SEND_MESSAGE_FAILED',
  // JWT
  SIGN_JWT_COMPLETE: 'SIGN_JWT_COMPLETE',
  SIGN_JWT_FAILED: 'SIGN_JWT_FAILED',
  // Sign
  SIGN_MESSAGE_COMPLETE: 'SIGN_MESSAGE_COMPLETE',
  SIGN_MESSAGE_FAILED: 'SIGN_MESSAGE_FAILED',
};
```

Example Usage: 
```js
// (Example using sendMessage)

// Listen for complete/success
const successAction = (result) => {
  console.log(`WalletConnectJS | Send Message Complete | Result: `, result);
};
walletConnectService.addListener(
  WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE,
  successAction
);
// Listen for error/failure
const failAction = (result) => {
  const { error } = result;
  console.log(`WalletConnectJS | Send Message Failed | result, error: `, result, error);
};
walletConnectService.addListener(
  WINDOW_MESSAGES.SEND_MESSAGE_FAILED,
  failAction
);
```

Alternatively, each method (other than connect) is an async method and the results can simply be awaited for:
```js
  const result = await walletConnectService.signMessage("test");
```

## WalletConnectContextProvider

React context provider to supply state to every child within

- Include as parent to all Components using `walletconnect-js`
- Optional: You may pass your own instance of walletConnectService into the context provider using the param `service`
- Optional: You may pass an auto-redirect url when disconnected into the provider using the param `connectionRedirect`
- Usage Example (w/React.js):

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

## QRCodeModal

To start the connection from dApp to wallet you will need to initiate the connection using the QRCodeModal component.

- Takes in the following params:
  - `walletConnectService`: Service pulled out of `useWalletConnect()` hook (Required)
  - `devWallets`: Array of allowed dev wallets to connect into. (Optional)
  - `hideWallets`: Array of prod wallets to hide from user. (Optional)
  - For list of available wallets and their IDs see `src/consts/walletList.ts`

- Usage:
  ```js
  // App.js
  import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
  ...
  export const App = () => {
    const { walletConnectService: wcs } = useWalletConnect();
    ...
    return (
      <QRCodeModal
        walletConnectService={wcs}
        devWallets={['figure_web_test', 'figure_mobile_test']}
        hideWallets={['figure_web', 'figure_mobile']}
      />
    )
  };
  ```
- Notes
  - This modal is built with React.js and will only work within a react project. If you are not using React.js look through the `examples` folder to see how to initiate the connection without QRCodeModal manually.

  - If using react-scripts 4 and below, you must be using walletconnect-js version 2.1.1 or below. Version 2.1.2 and above require react-scripts 5.x.x+ to use the QRCodeModal.

## useWalletConnect

React hook which contains `walletConnectService` and `walletConnectState`

## walletConnectService

- Holds all main methods and functions to use WalletConnect service

- #### connect

  Connect a WalletConnect wallet

  ```js
  walletConnectService.connect({bridge, duration, noPopup});
  // WINDOW_MESSAGE: CONNECTED
  ```

  | Param  | Type   | Required | Default                | Example      | Info                                    |
  | ------ | ------ | -------- | ---------------------- | ------------ | --------------------------------------- |
  | bridge | string | no       | `"wss://figure.tech/service-wallet-connect-bridge/ws/external"` | `"wss://custom.bridge"` | Custom bridge to connect into |
  | duration | number | no       | `1800` | `3600` | Custom connection timeout in seconds |
  | noPopup | boolean | no       | false | true | Should the QRCodeModal popup automatically on connect call |
  | address | string | no       | `''` | `tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh` | Required address for dApp connection |
  | prohibitGroups | boolean | no       | `false` | `true` | Prohibit group accounts from connecting to this dApp |

- #### disconnect

  Disconnect current session

  ```js
  walletConnectService.disconnect();
  // WINDOW_MESSAGE: DISCONNECT
  ```

- #### resetConnectionTimeout

  Change the amount of connection time remaining for the currenct walletconnect session
  ```js
  walletConnectService.resetConnectionTimeout(connectionTimeout);
  ```
  | Param   | Type   | Required | Default | Example               | Info                   |
  | ------- | ------ | -------- | ------- | --------------------- | ---------------------- |
  | connectionTimeout | number | no      | 1800       | 3600 | Seconds to extend current session |

- #### signJWT

  Prompt user to sign a generated JWT (Async)

  ```js
  walletConnectService.signJWT(expire);
  // WINDOW_MESSAGES: SIGN_JWT_COMPLETE, SIGN_JWT_FAILED
  ```

  | Param  | Type   | Required | Default                | Example      | Info                                    |
  | ------ | ------ | -------- | ---------------------- | ------------ | --------------------------------------- |
  | expire | number | no       | 24 hours (Date.now() + 86400) | `1647020269` | Custom expiration date (ms) of JWT |

- #### sendMessage

  Pass through a custom base64 encoded message (Async)

  ```js
  walletConnectService.sendMessage({
    message,
    description,
    method,
    gasPrice,
    feeGranter,
    feePayer,
    memo,
    timeoutHeight,
    extensionOptions,
    nonCriticalExtensionOptions,
  });
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

- #### signMessage
  Prompt user to sign a custom hex string message (Async)
  ```js
  walletConnectService.signMessage(message);
  // WINDOW_MESSAGES: SIGN_MESSAGE_COMPLETE, SIGN_MESSAGE_FAILED
  ```
  | Param   | Type   | Required | Default | Example               | Info                   |
  | ------- | ------ | -------- | ------- | --------------------- | ---------------------- |
  | message | hex string | yes      | -       | `'My Custom Message'` | Hex string message to send |

## walletConnectState

- Holds current walletconnect-js state values
  ```js
  initialState: {
    address: '', // Wallet address [string]
    bridge: 'wss://figure.tech/service-wallet-connect-bridge/ws/external', // WalletConnect bridge used for connection [string]
    connected: false, // WalletConnect connected [bool]
    connectionEat: null, // WalletConnect expires at time [number]
    connectionIat: null, // WalletConnect initialized at time [number]
    connectionTimeout: 1800, // Default timeout duration (seconds)
    connector: null, // WalletConnect connector
    isMobile: false, // Is the connected browser a mobile device [bool]
    loading: '', // Are any methods currently loading/pending [string]
    peer: {}, // Connected wallet info [object]
    publicKey: '', // Wallet public key (base64url encoded)
    QRCode: '', // QRCode image data to connect to WalletConnect bridge [string]
    QRCodeUrl: '', // QRCode url contained within image [string]
    showQRCodeModal: false, // Should the QR modal be open [bool]
    signedJWT: '', // Signed JWT token [string]
    walletAppId: '', // What type of wallet is this "provenance_extension" | "provenance_mobile" | "figure_web"
    walletInfo: {}, // Contains wallet coin, id, and name
    representedGroupPolicy: null, //Present when the wallet holder is acting on behalf of a group
  }
  ```

## Web App

This package comes bundled with a full demos that you can run locally to test out the various features of `walletconnect-js`.
To see how to initiate and run the different examples, look through the [README.md](./examples/README.md)

- Quick Start:
  1. Pull down the latest `walletconnect-js`.
  2. Run `npm i` to install all the required node packages
  3. Run `npm run start` to launch a localhost demo.

## Non React Setup

This package works without react and with any other javascipt library/framework (tested with vanilla js)

### Using a CDN Import

You can find this package on `https://unpkg.com/`: - Note: Change the version in the url as needed: `https://unpkg.com/@provenanceio/walletconnect-js@2.0.0/umd/walletconnect-js.min.js` - Example use:
`js <script src="https://unpkg.com/@provenanceio/walletconnect-js@2.0.0/umd/walletconnect-js.min.js"></script> `

### Using Imports

There are a few differences in getting setup and running: 1) Note [Webpack 5 Issues](#Webpack-5-Issues) 2) When connecting, you will need to manually generate the QR code image element (Component is only available to React.js apps) 3) Don't use the default imports (`@provenanceio/walletconnect-js`), instead pull the service from `@provenanceio/walletconnect-js/lib/service` 4) Don't forget to set up event and loading listeners \* Basic non-React.js example with

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


