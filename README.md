<div align="center">
  <img src="./src/logo.svg" alt="Provenance.io WalletConnect-JS"/>
</div>
<br/><br/>

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
   - [activateRequest](#activateRequest)
   - [addMarker](#addMarker)
   - [cancelRequest](#cancelRequest)
   - [connect](#connect)
   - [customAction](#customAction)
   - [delegateHash](#delegateHash)
   - [disconnect](#disconnect)
   - [sendCoin](#sendCoin)
   - [sendHash](#sendHash)
   - [signJWT](#signJWT)
   - [signMessage](#signMessage)
7. [walletConnectState](#walletConnectState)
8. [Web App](#Web-App)
9. [Non React Setup](#Non-React-Setup)
10. [Webpack 5 Issues](#Webpack-5-Issues)
11. [Clone LocalStorage](#Automatic-localSession-copy)
12. [WalletConnect-js Status](#Status)

## Installation

Import the dependency

```bash
npm install @provenanceio/walletconnect-js --save
```

Importable items:

```js
import {
  WINDOW_MESSAGES,
  WalletConnectContextProvider,
  useWalletConnect,
} from "@provenanceio/walletconnect-js";
```

## Window Messages

Each method will return a window message indicating whether it failed or was completed as well as the result

_Note A: See `walletConnectService` for all `WINDOW_MESSAGES` based on method._
_Note B: All of these are based off Node.js Event Emitters, read more on them here: [Node.js Event Emitters](https://nodejs.org/api/events.html#event-newlistener)_

```js
// (Example using cancelRequest)

// Listen for complete/success
const successAction = (result) => {
  console.log(`WalletConnectJS | Complete | Result: `, result);
};
walletConnectService.addListener(
  WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE,
  successAction
);
// Listen for error/failure
const failAction = (result) => {
  const { error } = result;
  console.log(`WalletConnectJS | Failed | result, error: `, result, error);
};
walletConnectService.addListener(
  WINDOW_MESSAGES.CANCEL_REQUEST_FAILED,
  failAction
);

// Unmount listeners once they are no longer needed (typically in useEffect return)
// Remove event listeners once no longer needed (Node: Each requires specific function to remove, see Note B above)
walletConnectService.removeListener(
  WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE,
  successAction
);
walletConnectService.removeListener(
  WINDOW_MESSAGES.CANCEL_REQUEST_FAILED,
  failAction
);
```

## WalletConnectContextProvider

React context provider to supply state to every child within

- Include as parent to all Components using `walletconnect-js`
- Takes in optional params:
  - `bridge`: WalletConnect bridge [`string`] (default: `"'wss://test.figure.tech/service-wallet-connect-bridge/ws/external'"`)
  - `timeout`: Session timeout, seconds [`number`] (default: `1800`)
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
    - For list of available wallets see `src/consts/walletList.ts`
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
        devWallets={['figure_web']}
      />
    )
  };
  ```
- Note: This modal is built with React.js and will only work within a react project. If you are not using React.js look through the `webDemoVanilla` folder to see how to initiate the connection without QRCodeModal manually.

## useWalletConnect

React hook which contains `walletConnectService` and `walletConnectState`

## walletConnectService

- Holds all main methods and functions to use WalletConnect service

- #### activateRequest

  Activate a request

  ```js
  walletConnectService.activateRequest(denom);
  // WINDOW_MESSAGES: ACTIVATE_REQUEST_COMPLETE, ACTIVATE_REQUEST_FAILED
  ```

  | Param | Type   | Required | Default | Example               | Info                  |
  | ----- | ------ | -------- | ------- | --------------------- | --------------------- |
  | denom | string | yes      | -       | `'My_Special_Marker'` | Title of denomination |

- #### addMarker

  Add a marker

  ```js
  walletConnectService.addMarker({ denom, amount });
  // WINDOW_MESSAGES: ADD_MARKER_COMPLETE, ADD_MARKER_FAILED
  ```

  | Param  | Type   | Required | Default | Example               | Info                   |
  | ------ | ------ | -------- | ------- | --------------------- | ---------------------- |
  | denom  | string | yes      | -       | `'My_Special_Marker'` | Title of denomination  |
  | amount | number | yes      | -       | `10`                  | Amount of denomination |

- #### cancelRequest

  Cancels a request

  ```js
  walletConnectService.cancelRequest(denom);
  // WINDOW_MESSAGES: CANCEL_REQUEST_COMPLETE, CANCEL_REQUEST_FAILED
  ```

  | Param | Type   | Required | Default | Example               | Info                  |
  | ----- | ------ | -------- | ------- | --------------------- | --------------------- |
  | denom | string | yes      | -       | `'My_Special_Marker'` | Title of denomination |

- #### connect

  Connect a WalletConnect wallet

  ```js
  walletConnectService.connect();
  // WINDOW_MESSAGE: CONNECTED
  ```

- #### customAction

  Pass through a custom base64 encoded message

  ```js
  walletConnectService.customAction({ message, description, method });
  // WINDOW_MESSAGES: CUSTOM_ACTION_COMPLETE, CUSTOM_ACTION_FAILED
  ```

  | Param       | Type           | Required | Default                                                           | Example                                      | Info                                                |
  | ----------- | -------------- | -------- | ----------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
  | message     | string / array | yes      | -                                                                 | `'CiwvcHJvdmVuYW5jZS5tZX...'`                | B64 encoded Message(s) to pass to wallet            |
  | description | string         | no       | `'Custom Action'`                                                 | `'My Custom Action'`                         | Prompt title on mobile wallet                       |
  | method      | string         | no       | `'provenance_sendTransaction'`                                    | `'provenance_sendTransaction'`               | Message method                                      |
  | gasPrice    | object         | no       | `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` | `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` | Optional gasPrice object, defaults to Figure values |

- #### delegateHash

  Delegate a custom amount of Hash token to a custom address

  ```js
  walletConnectService.delegateHash({ to, amount });
  // WINDOW_MESSAGES: DELEGATE_HASH_COMPLETE, DELEGATE_HASH_FAILED
  ```

  | Param  | Type   | Required | Default | Example        | Info                  |
  | ------ | ------ | -------- | ------- | -------------- | --------------------- |
  | to     | string | yes      | -       | `'tpa1b23...'` | Target wallet address |
  | amount | number | yes      | -       | `10`           | Amount to use         |

- #### disconnect

  Disconnect current session

  ```js
  walletConnectService.disconnect();
  // WINDOW_MESSAGE: DISCONNECT
  ```

- #### sendCoin

  Send amount of custom coin to an address

  ```js
  walletConnectService.sendCoin({ to, amount, denom });
  // WINDOW_MESSAGES: TRANSACTION_COMPLETE, TRANSACTION_FAILED
  ```

  | Param    | Type   | Required | Default                                                           | Example                                      | Info                                                |
  | -------- | ------ | -------- | ----------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
  | to       | string | yes      | -                                                                 | `'tpa1b23...'`                               | Target wallet address                               |
  | amount   | number | yes      | -                                                                 | `10`                                         | Amount to use                                       |
  | denom    | string | no       | `'Hash'`                                                          | `'Hash'`                                     | Coin's Denom                                        |
  | gasPrice | object | no       | `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` | `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` | Optional gasPrice object, defaults to Figure values |

- #### signJWT

  Prompt user to sign a generated JWT

  ```js
  walletConnectService.signJWT(expire);
  // WINDOW_MESSAGES: SIGN_JWT_COMPLETE, SIGN_JWT_FAILED
  ```

  | Param  | Type   | Required | Default                | Example      | Info                                    |
  | ------ | ------ | -------- | ---------------------- | ------------ | --------------------------------------- |
  | expire | number | no       | 24 hours (Date.now() + 86400) | `1647020269` | Custom expiration date (ms) of JWT |

- #### signMessage
  Prompt user to sign a custom message
  ```js
  walletConnectService.signMessage(message);
  // WINDOW_MESSAGES: SIGNATURE_COMPLETE, SIGNATURE_FAILED
  ```
  | Param   | Type   | Required | Default | Example               | Info                   |
  | ------- | ------ | -------- | ------- | --------------------- | ---------------------- |
  | message | string | yes      | -       | `'My Custom Message'` | String message to send |

## walletConnectState

- Holds current walletconnect-js state values
  ```js
  initialState: {
    account: '', // Figure account uuid [string]
    address: '', // Wallet address [string]
    connected: false, // WalletConnect connected [bool]
    connectionEat: null, // WalletConnect expires at time [number]
    connectionIat: null, // WalletConnect initialized at time [number]
    connectionTimeout: 1800, // Default timeout duration (seconds)
    connector: null, // WalletConnect connector
    figureConnected: false, // Account and address both exist [bool]
    isMobile: false, // Is the connected browser a mobile device [bool]
    loading: '', // Are any methods currently loading/pending [string]
    newAccount: false, // Is this a newly created account
    peer: {}, // Connected wallet info [object]
    publicKey: '', // Wallet public key (base64url encoded)
    QRCode: '', // QRCode image data to connect to WalletConnect bridge [string]
    QRCodeUrl: '', // QRCode url contained within image [string]
    showQRCodeModal: false, // Should the QR modal be open [bool]
    signedJWT: '', // Signed JWT token [string]
    walletApp: '', // What type of wallet is this "provenance_extension" | "provenance_mobile" | "figure_web"
    walletInfo: {}, // Contains wallet coin, id, and name
  }
  ```

## Web App

This package comes bundled with a full React demo that you can run locally to test out the various features of `walletconnect-js`.
To see how to initiate and run the webDemo, look through the [webDemo README.md](./webDemo/README.md)

- Quick Start:
  1. Pull down the latest `walletconnect-js`.
  2. Run `npm i` to install all the required node packages
  3. Run `npm run start` to launch a localhost demo.

## Non React Setup

This package works without react and with any other javascipt library/framework (tested with vanilla js)

### Using a CDN Import

You can find this package on `https://unpkg.com/`: - Note: Change the version in the url as needed: `https://unpkg.com/@provenanceio/walletconnect-js@1.0.19/umd/walletconnect-js.min.js` - Example use:
`js <script src="https://unpkg.com/@provenanceio/walletconnect-js@1.0.19/umd/walletconnect-js.min.js"></script> `

### Using Imports

There are a few differences in getting setup and running: 1) Note [Webpack 5 Issues](#Webpack-5-Issues) 2) When connecting, you will need to manually generate the QR code image element (Component is only available to React.js apps) 3) Don't use the default imports (`@provenanceio/walletconnect-js`), instead pull the service from `@provenanceio/walletconnect-js/lib/service` 4) Don't forget to set up event and loading listeners \* Basic non-React.js example with

```js
import { WalletConnectService, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js/lib/service';

      // Pull out the service (includes methods and state)
      const walletConnectService = new WalletConnectService();
      // Function to generate a QR code img element
      const generateQRImgElement = () => {
        // Pull `QRCode` from `WalletConnectService` state and use it as the element `src`
        const QRCodeData = walletConnectService.state.QRCode;
        const QRImage = document.createElement('img');
        QRImage.src = QRCodeData;
        return QRImage;
      };
      // Function to generate a custom button element
      const Button = (content: string, id?: string, onClick?: () => void) => {
        const button = document.createElement('button');
        button.textContent = content;
        button.id = id;
        if (onClick) button.addEventListener('click', onClick);
        return button;
      };
      // Initialize wcjs connection (builds qrCode into state)
      const connect = async () => {
        await walletConnectService.connect();
        // Build QRCode img element
        const QRImageElement = generateQRImgElement();
        // Take this QR element and appendChild to wherever you wanted to render it
        document.body.appendChild(QRImageElement);
        // User can now scan the QR code to connect
      }
      // Manually disconnect from the wc-js session
      const disconnect = async () => { await walletConnectService.disconnect(); };
      // wc-js has returned a connection event, we should have data to use
      const connectionEvent = (result) => {
        const { address, publicKey } = walletConnectService.state;
        document.body.innerHTML = `
          <div>Status: Connected to wallet via ${result.connectionType}</div>
          <div>Address: ${address}</div>
          <div>PublicKey: ${publicKey}</div>
        `;
        document.body.appendChild(Button('Disconnect', 'disconnect', disconnect));
      }
      // Something has caused wc-js to return a disconnect event, we're no longer connected
      const disconnectEvent = (result) => {
        // Clear everything out, re-add the connect button
        document.body.innerHTML = '';
        document.body.appendChild(Button('Connect', 'connect', connect));
      };
      // Listen for specific walletconnect-js events
      const setupEventListeners = () => {
        // Connected
        walletConnectService.addListener(WINDOW_MESSAGES.CONNECTED, connectionEvent)
        // Disconnected
        walletConnectService.addListener(WINDOW_MESSAGES.DISCONNECT, disconnectEvent)
      }
      // Initial function when page/app loads
      const init = () => {
        setupEventListeners();
        document.body.appendChild(Button('Connect', 'connect', connect));
      };
      // Run on app load
      init();
```

## Webpack 5 Issues

If you are on Webpack version 5+ (Note: Create React App 5+ uses Webpack 5+) then you will likely encounter a message like this:

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

To fix this issue, add the following plugins and module rules to your `webpack.config.js`:

```js
const webpack = require('webpack');
...
module.exports = {
  ...
  plugins: [
    ...
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify")
    },
  },
};
```
If using React Create App, you will need to install a new package called `react-app-rewired`.  After installing, swap your `react-scripts` start command with `react-app-rewired` start. Create a new file named `config-overrides.js` in the root of your project as follows:
```js
const webpack = require("webpack");

module.exports = function override(config) {
  // Pull any existing fallbacks from config, or make a new fallback object
  const fallback = config.resolve.fallback || {};
  // Merge/add new webpack fallbacks
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
  });
  // Set new fallback into config
  config.resolve.fallback = fallback;
  // Combine new plugins with any existing plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  // Return updated/modified webpack config
  return config;
};

```

Next, make sure to have the following packages added into your `package.json` dependencies or devDependencies list:

```json
  "buffer",
  "crypto-browserify",
  "process",
  "stream-browserify",
  "util"
```
Quickly add these to your dependencies with this command: 
```js
npm i --save-dev buffer crypto-browserify process stream-browserify util
```
For more information/examples, look through the `webDemo` files and structure which uses these methods.

## Automatic localSession copy

Copy `window.localStorage` values from one site to another (mainly, to `localHost`)

1. Run this command in console on the first page you with to copy from

```js
copy(`Object.entries(${JSON.stringify(localStorage)})
.forEach(([k,v])=>localStorage.setItem(k,v))`);
```

2. Paste result (clipboard should automatically have been filled) into target page console.
3. Refresh page, storage values should be synced.

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
