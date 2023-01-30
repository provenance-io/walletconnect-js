import { Wallet } from '../../types';

export const extensionProvenance = {
  id: 'provenance_extension',
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
  id: 'figure_extension',
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
