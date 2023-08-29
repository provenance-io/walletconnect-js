import { HOSTED_IFRAME_EVENT_TYPE } from '../../consts';
import { Wallet, WalletEventValue } from '../../types';
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
  eventAction: (eventData) => {
    const { event } = eventData;
    // If we have an event, make sure it's not an "ignored" event
    if (event && !FIGURE_HOSTED_IGNORED_EVENTS.includes(event)) {
      window.document.dispatchEvent(
        new CustomEvent(HOSTED_IFRAME_EVENT_TYPE, {
          detail: { ...eventData, walletId: WALLET_APP_IDS.FIGURE_HOSTED },
        })
      );
    }
  },
} as Wallet;

export const FIGURE_HOSTED_TEST = {
  dev: true,
  id: WALLET_APP_IDS.FIGURE_HOSTED_TEST,
  type: ['hosted', 'mobile'],
  title: 'Figure Account (Test)',
  icon: 'figure',
  eventAction: (eventData) => {
    const { event } = eventData;
    // If we have an event, make sure it's not an "ignored" event
    if (event && !FIGURE_HOSTED_IGNORED_EVENTS.includes(event)) {
      window.document.dispatchEvent(
        new CustomEvent(HOSTED_IFRAME_EVENT_TYPE, {
          detail: { ...eventData, walletId: WALLET_APP_IDS.FIGURE_HOSTED_TEST },
        })
      );
    }
  },
} as Wallet;
