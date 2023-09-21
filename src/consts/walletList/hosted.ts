import { CUSTOM_EVENT_HOSTED } from '../../consts';
import { BrowserEventValue, BrowserWallet } from '../../types';
import { FIGURE_HOSTED_WALLET_URL_PROD } from '../urls';
import { WALLET_IDS } from '../wallet';

const FIGURE_HOSTED_IGNORED_EVENTS: BrowserEventValue[] = ['resetConnectionTimeout'];

export const FIGURE_HOSTED = {
  id: WALLET_IDS.FIGURE_HOSTED,
  type: 'browser',
  title: 'Figure Account',
  icon: 'figure',
  browserEventAction: (browserEventData) =>
    new Promise((resolve, reject) => {
      const { individualAddress, browserEvent } = browserEventData;
      // If we have an event, make sure it's not an "ignored" event
      if (browserEvent && !FIGURE_HOSTED_IGNORED_EVENTS.includes(browserEvent)) {
        // Build a full set of urlSearchParams to append to the url
        const searchParams = new URLSearchParams();
        if (individualAddress) searchParams.append('address', individualAddress);
        if (browserEvent) searchParams.append('event', browserEvent);
        // if (redirectUrl) searchParams.append('redirectUrl', redirectUrl);
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
        resolve({});
      }
    }),
} as BrowserWallet;

export const FIGURE_HOSTED_TEST = {
  dev: true,
  id: WALLET_IDS.FIGURE_HOSTED_TEST,
  type: 'browser',
  title: 'Figure Account (Test)',
  icon: 'figure',
  browserEventAction: (browserEventData) =>
    new Promise((resolve, reject) => {
      const { browserEvent } = browserEventData;
      // If we have an event, make sure it's not an "ignored" event
      if (browserEvent && !FIGURE_HOSTED_IGNORED_EVENTS.includes(browserEvent)) {
        window.document.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_HOSTED, {
            detail: {
              ...browserEventData,
              walletId: WALLET_IDS.FIGURE_HOSTED_TEST,
            },
          })
        );
      }
      resolve({});
    }),
} as BrowserWallet;
