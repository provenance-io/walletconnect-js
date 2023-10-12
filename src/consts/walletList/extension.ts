import { BrowserWallet, BrowserWalletEventActionMessages, BrowserWalletEventActionResponses } from '../../types';
import { BROWSER_MESSAGE_SENDERS, CUSTOM_EVENT_EXTENSION } from '../browserEvents';
import { WALLET_IDS } from '../wallet';

export const FIGURE_EXTENSION = {
  id: WALLET_IDS.FIGURE_EXTENSION,
  type: 'browser',
  title: 'Figure Extension',
  icon: 'figure',
  browserEventAction: (browserEventData, method) =>
    new Promise((resolve, reject) => {
      const detail = { request: browserEventData, sender: BROWSER_MESSAGE_SENDERS.WCJS } as BrowserWalletEventActionMessages[typeof method];
      const sendMessageEvent = new CustomEvent(CUSTOM_EVENT_EXTENSION, { detail });
      console.log('wcjs | eventAction | sendMessageEvent: ', sendMessageEvent);
      dispatchEvent(sendMessageEvent);
      // We will resolve this once we get a response back from content-script.js
      // Only listen once
      addEventListener(
        CUSTOM_EVENT_EXTENSION,
        (message) => {
          // TODO: Get sender types
          const {
            sender,
            result,
          }: {
            sender: string;
            result: BrowserWalletEventActionResponses[typeof method];
          } = (message as CustomEvent).detail;
          // Only listen to messages sent by the content-script
          // TODO: Maybe check the origin instead? Might get wires crossed with multiple tab requests
          if (sender === 'content-script') {
            console.log('wcjs | eventAction | catchEvent | message: ', message);
            resolve(result);
          }
        },
        { once: true }
      );
    }),
  walletUrl:
    'https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc',
  walletUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/figure-wallet/',
  },
  walletCheck: () =>
    !!(window?.figureWalletExtension && window?.figureWalletExtension?.isFigure),
} as BrowserWallet;
