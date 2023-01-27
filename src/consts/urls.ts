export const WALLETCONNECT_BRIDGE_URL =
  'wss://figure.tech/service-wallet-connect-bridge/ws/external';

// MOBILE WALLET FIREBASE KEYS/APIS
// -- Provenance
const FIREBASE_PROJECT_API_KEY_PROVENANCE =
  'AIzaSyBNzgtDMBU_7Df1MjTGjHyj4_3pLYtdOY8';
const FIREBASE_PROJECT_URL =
  'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';
export const FIREBASE_FETCH_WALLET_URL_PROVENANCE = `${FIREBASE_PROJECT_URL}?key=${FIREBASE_PROJECT_API_KEY_PROVENANCE}`;
// -- Figure
const FIREBASE_PROJECT_API_KEY_FIGURE = 'AIzaSyDgxmYAGpQGHKCoJ3LW6CnD9B_utl3sLkY';
export const FIREBASE_FETCH_WALLET_URL_FIGURE = `${FIREBASE_PROJECT_URL}?key=${FIREBASE_PROJECT_API_KEY_FIGURE}`;

// APP STORE ICONS
export const APP_STORE_GOOGLE_PLAY_PROVENANCE =
  'https://play.google.com/store/apps/details?id=io.provenance.wallet';
export const APP_STORE_APPLE_PROVENANCE =
  'https://apps.apple.com/us/app/provenance-blockchain-wallet/id1606428494';

export const APP_STORE_GOOGLE_PLAY_FIGURE =
  'https://play.google.com/store/apps/details?id=com.figure.mobile.wallet';
export const APP_STORE_APPLE_FIGURE =
  'https://apps.apple.com/us/app/figure-wallet/id6444263900';

// FIGURE WEB WALLET URLS
export const FIGURE_WEB_WALLET_TEST_URL = 'https://test.figure.com/figure-wallet';
export const FIGURE_WEB_WALLET_PROD_URL = 'https://www.figure.com/figure-wallet';
