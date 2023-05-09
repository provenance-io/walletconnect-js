import { Wallet, WalletEventValue } from '../../types';
import {
  FIGURE_HOSTED_WALLET_URL_PROD,
  FIGURE_HOSTED_WALLET_URL_TEST,
} from '../urls';
import { WALLET_APP_IDS } from '../walletAppIds';

const FIGURE_HOSTED_IGNORED_EVENTS: WalletEventValue[] = [
  'walletconnect_connect',
  'walletconnect_session_update',
  'resetConnectionTimeout',
];

export const FIGURE_HOSTED = {
  id: WALLET_APP_IDS.FIGURE_HOSTED,
  type: ['hosted', 'mobile'],
  title: 'Figure Account',
  icon: 'figure',
  eventAction: ({ uri, address, event, redirectUrl }) => {
    // If we have an event, make sure it's not an "ignored" event
    if (event && !FIGURE_HOSTED_IGNORED_EVENTS.includes(event)) {
      // Build a full set of urlSearchParams to append to the url
      const searchParams = new URLSearchParams();
      if (uri) searchParams.append('wc', uri);
      if (address) searchParams.append('address', address);
      if (event) searchParams.append('event', event);
      if (redirectUrl) searchParams.append('redirectUrl', redirectUrl);
      const searchParamsString = searchParams.toString();
      const url = `${FIGURE_HOSTED_WALLET_URL_PROD}${
        searchParamsString ? `&${searchParamsString}` : ''
      }`;
      const width = 600;
      const height = window.outerHeight < 750 ? window.outerHeight : 550;
      const top = window.outerHeight / 2 + window.screenY - height / 2;
      const left = window.outerWidth / 2 + window.screenX - width / 2;
      const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
      window.open(url, 'figure-wallet-hosted', windowOptions);
    }
  },
} as Wallet;

export const FIGURE_HOSTED_TEST = {
  dev: true,
  id: WALLET_APP_IDS.FIGURE_HOSTED_TEST,
  type: ['hosted', 'mobile'],
  title: 'Figure Account (Test)',
  icon: 'figure',
  eventAction: ({ uri, address, event, redirectUrl }) => {
    // If we have an event, make sure it's not an "ignored" event
    if (event && !FIGURE_HOSTED_IGNORED_EVENTS.includes(event)) {
      const overrideUrl = localStorage.getItem(
        'FIGURE_HOSTED_WALLET_URL_TEST_OVERRIDE'
      );
      const windowUrl = new URL(overrideUrl ?? `${FIGURE_HOSTED_WALLET_URL_TEST}`);
      if (uri) windowUrl.searchParams.append('wc', uri);
      if (address) windowUrl.searchParams.append('address', address);
      if (event) windowUrl.searchParams.append('event', event);
      if (redirectUrl) windowUrl.searchParams.append('redirectUrl', redirectUrl);
      const width = 600;
      const height = window.outerHeight < 750 ? window.outerHeight : 550;
      const top = window.outerHeight / 2 + window.screenY - height / 2;
      const left = window.outerWidth / 2 + window.screenX - width / 2;
      const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
      window.open(windowUrl.toString(), 'figure-wallet-hosted-test', windowOptions);
    }
  },
} as Wallet;
