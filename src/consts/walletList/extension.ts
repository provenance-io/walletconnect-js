import { WALLET_APP_IDS } from '../walletAppIds';
import { Wallet } from '../../types';

export const extensionProvenance = {
  id: WALLET_APP_IDS.PROVENANCE_EXTENSION,
  type: 'extension',
  dev: true,
  title: 'Provenance Extension',
  icon: 'provenance',
  eventAction: (eventData) => {
    const sendMessageEvent = new CustomEvent('provWalletSendMessage', {
      detail: eventData,
    });
    window.document.dispatchEvent(sendMessageEvent);
  },
  walletUrl:
    'https://chrome.google.com/webstore/detail/provenance-blockchain-wal/pfcpdmimlaffecihgamfbnfffmdlhkmh',
  walletCheck: () => !!(window?.provenance && window?.provenance?.isProvenance),
} as Wallet;

export const extensionFigure = {
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
