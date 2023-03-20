import { WALLET_APP_IDS } from '../walletAppIds';
import { Wallet } from '../../types';

export const FIGURE_EXTENSION = {
  id: WALLET_APP_IDS.FIGURE_EXTENSION,
  type: 'extension',
  title: 'Figure Extension',
  icon: 'figure',
  eventAction: (eventData) => {
    const sendMessageEvent = new CustomEvent('figureWalletExtensionSendMessage', {
      detail: eventData,
    });
    window.document.dispatchEvent(sendMessageEvent);
  },
  walletUrl:
    'https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc',
  walletCheck: () =>
    !!(window?.figureWalletExtension && window?.figureWalletExtension?.isFigure),
} as Wallet;
