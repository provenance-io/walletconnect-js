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
4. [useWalletConnect](#useWalletConnect)
5. [walletConnectService](#walletConnectService)
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
6. [walletConnectState](#walletConnectState)
7. [Web App](#Web-App)
8. [Non React Setup](#Non-React-Setup)
9. [Webpack 5 Issues](#Webpack-5-Issues)
10. [Clone LocalStorage](#Automatic-localSession-copy)
11. [WalletConnect-js Status](#Status)

## Installation

Import the dependency

```bash
npm install @provenanceio/walletconnect-js --save
```

Importable items:

```js
import { WINDOW_MESSAGES, WalletConnectContextProvider, useWalletConnect } from '@provenanceio/walletconnect-js';
```
## Window Messages
Each method will return a window message indicating whether it failed or was completed as well as the result

*Note A: See `walletConnectService` for all `WINDOW_MESSAGES` based on method.*
*Note B: All of these are based off Node.js Event Emitters, read more on them here: [Node.js Event Emitters](https://nodejs.org/api/events.html#event-newlistener)*
```js
// (Example using cancelRequest)

// Listen for complete/success
const successAction = (result) => { console.log(`WalletConnectJS | Complete | Result: `, result); }
walletConnectService.addListener(WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE, successAction);
// Listen for error/failure
const failAction = (result) => { const { error } = result; console.log(`WalletConnectJS | Failed | result, error: `, result, error); }
walletConnectService.addListener(WINDOW_MESSAGES.CANCEL_REQUEST_FAILED, failAction);

// Unmount listeners once they are no longer needed (typically in useEffect return)
// Remove event listeners once no longer needed (Node: Each requires specific function to remove, see Note B above)
walletConnectService.removeListener(WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE, successAction);
walletConnectService.removeListener(WINDOW_MESSAGES.CANCEL_REQUEST_FAILED, failAction);
```

## WalletConnectContextProvider
React context provider to supply state to every child within
  - Include as parent to all Components using `walletconnect-js`
  - Takes in optional params:
    - `network`: Chain network of `"mainnet"` or `"testnet"` [`string`] (default: `"mainnet"`)
    - `bridge`: WalletConnect bridge [`string`] (default: `"'wss://test.figure.tech/service-wallet-connect-bridge/ws/external'"`)
    - `timeout`: Session timeout, seconds [`number`] (default: `1800`)
  - Usage Example (w/React.js):
    ```js
    // index.js
    ...

    ReactDOM.render(
      <WalletConnectContextProvider network="testnet">
        <App />
      </WalletConnectContextProvider>,
      document.getElementById('root')
    );
    ```

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
    | Param 	| Type   	| Required 	| Default 	| Example               	| Info                  	|
    |-------	|--------	|----------	|---------	|-----------------------	|-----------------------	|
    | denom 	| string 	| yes      	| -       	| `'My_Special_Marker'` 	| Title of denomination 	|

  - #### addMarker
    Add a marker
    ```js
      walletConnectService.addMarker({ denom, amount });
      // WINDOW_MESSAGES: ADD_MARKER_COMPLETE, ADD_MARKER_FAILED
    ```
    | Param  	| Type   	| Required 	| Default 	| Example               	| Info                   	|
    |--------	|--------	|----------	|---------	|-----------------------	|------------------------	|
    | denom  	| string 	| yes      	| -       	| `'My_Special_Marker'` 	| Title of denomination  	|
    | amount 	| number 	| yes      	| -       	| `10`                  	| Amount of denomination 	|

  - #### cancelRequest
    Cancels a request
    ```js
      walletConnectService.cancelRequest(denom);
      // WINDOW_MESSAGES: CANCEL_REQUEST_COMPLETE, CANCEL_REQUEST_FAILED
    ```
    | Param 	| Type   	| Required 	| Default 	| Example               	| Info                  	|
    |-------	|--------	|----------	|---------	|-----------------------	|-----------------------	|
    | denom 	| string 	| yes      	| -       	| `'My_Special_Marker'` 	| Title of denomination 	|

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
    | Param       	| Type   	        | Required 	| Default                        	                                    | Example                        	              | Info                                   	  |
    |-------------	|---------------	|----------	|-------------------------------------------------------------------- |---------------------------------------------	|-----------------------------------------  |
    | message     	| string / array 	| yes      	| -                              	                                    | `'CiwvcHJvdmVuYW5jZS5tZX...'`  	              | B64 encoded Message(s) to pass to wallet 	|
    | description 	| string 	        | no       	| `'Custom Action'`              	                                    | `'My Custom Action'`           	              | Prompt title on mobile wallet         	  |
    | method      	| string 	        | no       	| `'provenance_sendTransaction'` 	                                    | `'provenance_sendTransaction'` 	              | Message method                        	  |
    | gasPrice      | object 	        | no       	| `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` 	| `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` 	| Optional gasPrice object, defaults to Figure values |

  - #### delegateHash
    Delegate a custom amount of Hash token to a custom address
    ```js
      walletConnectService.delegateHash({ to, amount });
      // WINDOW_MESSAGES: DELEGATE_HASH_COMPLETE, DELEGATE_HASH_FAILED
    ```
    | Param  	| Type   	| Required 	| Default 	| Example        	| Info                  	|
    |--------	|--------	|----------	|---------	|----------------	|-----------------------	|
    | to     	| string 	| yes      	| -       	| `'tpa1b23...'` 	| Target wallet address 	|
    | amount 	| number 	| yes      	| -       	| `10`           	| Amount to use         	|

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
    | Param  	 | Type   	| Required 	| Default 	                                                          | Example        	                              | Info                  	|
    |--------- |--------	|----------	|-------------------------------------------------------------------- |---------------------------------------------	|-----------------------	|
    | to     	 | string 	| yes      	| -       	                                                          | `'tpa1b23...'` 	                              | Target wallet address 	|
    | amount 	 | number 	| yes      	| -       	                                                          | `10`           	                              | Amount to use         	|
    | denom 	 | string 	| no      	| `'Hash'` 	                                                          | `'Hash'`       	                              | Coin's Denom          	|
    | gasPrice | object 	| no       	| `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` 	| `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` 	| Optional gasPrice object, defaults to Figure values |

  - #### sendHash
    Send a custom amount of Hash token to a custom address
    ```js
      walletConnectService.sendHash({ to, amount });
      // WINDOW_MESSAGES: TRANSACTION_COMPLETE, TRANSACTION_FAILED
    ```
    | Param  	 | Type   	| Required 	| Default 	                                                          | Example        	                              | Info                  	|
    |--------- |--------	|----------	|-------------------------------------------------------------------	|---------------------------------------------	|-----------------------	|
    | to     	 | string 	| yes      	| -       	                                                          | `'tpa1b23...'` 	                              | Target wallet address 	|
    | amount 	 | number 	| yes      	| -       	                                                          | `10`           	                              | Amount to use         	|
    | gasPrice | object 	| no       	| `{ gasPrice: [Figure Default], gasPriceDenom: [Figure Default] }` 	| `{ gasPrice: 1337, gasPriceDenom: 'nhash' }` 	| Optional gasPrice object, defaults to Figure values |

  - #### signJWT
    Prompt user to sign a generated JWT
    ```js
      walletConnectService.signJWT(expire);
      // WINDOW_MESSAGES: SIGN_JWT_COMPLETE, SIGN_JWT_FAILED
    ```
    | Param  	| Type   	| Required 	| Default               	| Example        	| Info                  	                  |
    |--------	|--------	|----------	|-----------------------	|----------------	|-----------------------------------------	|
    | expire  | number 	| no      	| 24 hours (now + 86400) 	| `1647020269` 	  | Custom expiration date (seconds) of JWT 	|

  - #### signMessage
    Prompt user to sign a custom message
    ```js
      walletConnectService.signMessage(message);
      // WINDOW_MESSAGES: SIGNATURE_COMPLETE, SIGNATURE_FAILED
    ```
    | Param   	| Type   	| Required 	| Default 	| Example               	| Info                   	|
    |---------	|--------	|----------	|---------	|-----------------------	|------------------------	|
    | message 	| string 	| yes      	| -       	| `'My Custom Message'` 	| String message to send 	|

## walletConnectState
  - Holds current walletconnect-js state values
    ```js
    initialState: {
      account: '', // Figure account uuid [string]
      address: '', // Wallet address [string]
      assets: [], // Wallet assets [array]
      connected: false, // WalletConnect connected [bool]
      connectionIat: null, // WalletConnect initialized at time [number]
      connectionEat: null, // WalletConnect expires at time [number]
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
    }
    ```

## Web App
This package comes bundled with a full React demo that you can run locally to test out the various features of `walletconnect-js`.
To see how to initiate and run the webDemo, look through the [webDemo README.md](./webDemo/README.md)

  * Quick Start:
    1) Pull down the latest `walletconnect-js`.
    2) Run `npm i` to install all the required node packages
    3) Run `npm run start` to launch a localhost demo, live updates take place on each page reload.

## Non React Setup
This package works without react and with any other javascipt library/framework (tested with vanilla js)

There are a few differences in getting setup and running:
  1) Note [Webpack 5 Issues](#Webpack-5-Issues)
  2) When connecting, you will need to manually generate the QR code image element (Component is only available to React.js apps)
  - Pull `QRCode` from `WalletConnectService` state
  - Use `QRCode` as image element `src`
    ```js
    const walletConnectService = new WalletConnectService();
    const QRCodeData = walletConnectService.state.QRCode;
    const QRImage = document.createElement('img');
    QRImage.src = QRCodeData;

    return QRImage;
    ```
  3) Don't forget to set up event and loading listeners.
  
## Webpack 5 Issues
If you are on Webpack version 5+ (Note: Create React App 5+ uses Webpack 5+) then you will likely encounter a message like this:

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

To fix this issue, add the following plugins and module rules to your `webpack.config.js` (Note, having `file-loader` allows for svg logos to load):
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
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
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
Next, make sure to have the following packages added into your `package.json` dependencies or devDependencies list:

```json
  "buffer",
  "crypto-browserify",
  "file-loader",
  "process",
  "stream-browserify",
  "util"
```

## Automatic localSession copy
Copy `window.localStorage` values from one site to another (mainly, to `localHost`)
  1) Run this command in console on the first page you with to copy from
  ```js
  copy(`Object.entries(${JSON.stringify(localStorage)})
  .forEach(([k,v])=>localStorage.setItem(k,v))`)
  ```
  2) Paste result (clipboard should automatically have been filled) into target page console.
  3) Refresh page, storage values should be synced.

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
