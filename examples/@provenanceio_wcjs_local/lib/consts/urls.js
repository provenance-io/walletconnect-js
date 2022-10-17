"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WALLETCONNECT_BRIDGE_URL = exports.FIREBASE_FETCH_WALLET_URL = exports.FIGURE_WEB_WALLET_URL = exports.APP_STORE_GOOGLE_PLAY = exports.APP_STORE_APPLE = void 0;
var WALLETCONNECT_BRIDGE_URL = 'wss://figure.tech/service-wallet-connect-bridge/ws/external';
exports.WALLETCONNECT_BRIDGE_URL = WALLETCONNECT_BRIDGE_URL;
var FIREBASE_PROJECT_API_KEY = 'AIzaSyBNzgtDMBU_7Df1MjTGjHyj4_3pLYtdOY8';
var FIREBASE_PROJECT_URL = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';
var FIREBASE_FETCH_WALLET_URL = "".concat(FIREBASE_PROJECT_URL, "?key=").concat(FIREBASE_PROJECT_API_KEY);
exports.FIREBASE_FETCH_WALLET_URL = FIREBASE_FETCH_WALLET_URL;
var APP_STORE_GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id=io.provenance.wallet';
exports.APP_STORE_GOOGLE_PLAY = APP_STORE_GOOGLE_PLAY;
var APP_STORE_APPLE = 'https://apps.apple.com/us/app/provenance-blockchain-wallet/id1606428494';
exports.APP_STORE_APPLE = APP_STORE_APPLE;
var FIGURE_WEB_WALLET_URL = 'https://test.figure.com/figure-wallet';
exports.FIGURE_WEB_WALLET_URL = FIGURE_WEB_WALLET_URL;