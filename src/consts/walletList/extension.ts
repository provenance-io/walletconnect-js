import { Wallet } from '../../types';
import { WALLET_APP_IDS } from '../walletAppIds';

const EVENT_WCJS_MESSAGE = 'figureWalletExtensionSendMessage';
export const FIGURE_EXTENSION = {
  id: WALLET_APP_IDS.FIGURE_EXTENSION,
  type: 'extension',
  title: 'Figure Extension',
  icon: 'figure',
  eventAction: (eventData) =>
    new Promise((resolve, reject) => {
      const sendMessageEvent = new CustomEvent(EVENT_WCJS_MESSAGE, {
        detail: eventData,
      });
      console.log('wcjs | eventAction | sendMessageEvent: ', sendMessageEvent);
      dispatchEvent(sendMessageEvent);
      // We will resolve this once we get a response back from content-script.js
      // Only listen once
      addEventListener(
        EVENT_WCJS_MESSAGE,
        (message) => {
          const { sender, result } = (message as CustomEvent).detail;
          // Only listen to messages sent by the content-script
          // TODO: Maybe check the origin instead? Might get wires crossed with multiple tab requests
          if (sender === 'content-script') {
            console.log('wcjs | eventAction | catchEvent | message: ', message);
            if (result) {
              if (result.error) {
                reject(result.error);
              } else {
                resolve(result);
              }
            }
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
} as Wallet;
