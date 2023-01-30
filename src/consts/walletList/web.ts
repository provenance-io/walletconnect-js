import { Wallet } from '../../types';
import { FIGURE_WEB_WALLET_PROD_URL, FIGURE_WEB_WALLET_TEST_URL } from '../urls';

export const webFigure = {
  id: 'figure_web',
  type: ['web', 'mobile'],
  title: 'Figure Web',
  icon: 'figure',
  eventAction: ({ uri, address, event }) => {
    // Build a full set of urlSearchParams to append to the url
    const searchParams = new URLSearchParams();
    if (uri) searchParams.append('wc', uri);
    if (address) searchParams.append('address', address);
    if (event) searchParams.append('event', event);
    const searchParamsString = searchParams.toString();
    const url = `${FIGURE_WEB_WALLET_PROD_URL}${
      searchParamsString ? `?${searchParamsString}` : ''
    }`;
    const width = 600;
    const height = window.outerHeight < 750 ? window.outerHeight : 550;
    const top = window.outerHeight / 2 + window.screenY - height / 2;
    const left = window.outerWidth / 2 + window.screenX - width / 2;
    const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
    // Redirect to Figure Connect page in new tab for connection requests
    if (event === 'walletconnect_init') window.open(url);
    else window.open(url, undefined, windowOptions);
  },
} as Wallet;

export const webFigureTest = {
  dev: true,
  id: 'figure_web_test',
  type: ['web', 'mobile'],
  title: 'Figure Web (Test)',
  icon: 'figure',
  eventAction: ({ uri, address, event }) => {
    // Build a full set of urlSearchParams to append to the url
    const searchParams = new URLSearchParams();
    if (uri) searchParams.append('wc', uri);
    if (address) searchParams.append('address', address);
    if (event) searchParams.append('event', event);
    const searchParamsString = searchParams.toString();
    const url = `${FIGURE_WEB_WALLET_TEST_URL}${
      searchParamsString ? `?${searchParamsString}` : ''
    }`;
    const width = 600;
    const height = window.outerHeight < 750 ? window.outerHeight : 550;
    const top = window.outerHeight / 2 + window.screenY - height / 2;
    const left = window.outerWidth / 2 + window.screenX - width / 2;
    const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
    // Redirect to Figure Connect page in new tab for connection requests
    if (event === 'walletconnect_init') window.open(url);
    else window.open(url, undefined, windowOptions);
  },
} as Wallet;
