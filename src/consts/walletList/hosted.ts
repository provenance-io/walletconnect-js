import { Wallet, WalletEventValue } from '../../types';
import { WALLET_APP_IDS } from '../walletAppIds';
import {
  FIGURE_HOSTED_WALLET_URL_TEST,
  FIGURE_HOSTED_WALLET_URL_PROD,
} from '../urls';

const FIGURE_HOSTED_IGNORED_EVENTS: WalletEventValue[] = [
  'walletconnect_connect',
  'walletconnect_session_update',
  'resetConnectionTimeout',
];

export const FIGURE_HOSTED = {
  id: WALLET_APP_IDS.FIGURE_HOSTED,
  type: ['hosted', 'mobile'],
  title: 'Figure Hosted',
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
      window.open(url, undefined, windowOptions);
    }
  },
} as Wallet;

export const FIGURE_HOSTED_TEST = {
  dev: true,
  id: WALLET_APP_IDS.FIGURE_HOSTED_TEST,
  type: ['hosted', 'mobile'],
  title: 'Figure Hosted (Test)',
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
      const url = `${FIGURE_HOSTED_WALLET_URL_TEST}${
        searchParamsString ? `&${searchParamsString}` : ''
      }`;
      const width = 600;
      const height = window.outerHeight < 750 ? window.outerHeight : 550;
      const top = window.outerHeight / 2 + window.screenY - height / 2;
      const left = window.outerWidth / 2 + window.screenX - width / 2;
      const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
      window.open(url, undefined, windowOptions);
    }
  },
} as Wallet;
