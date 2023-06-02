import { useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { EventData } from 'types';
import { FIGURE_HOSTED_WALLET_URL_TEST } from '../../consts';

const IFRAME_NOTIFICATION_HEIGHT = 600;
const IFRAME_NOTIFICATION_WIDTH = 375;
const IFRAME_ID = 'figure-wallet-hosted';
const EVENT_WCJS_MESSAGE = '';

// Check if the iframe exists
const iframeExists = () => !!document.getElementById(IFRAME_ID);

// If the iframe element exists, remove it from the drop (close)
const removeIframe = () => {
  const iframeElement = document.getElementById(IFRAME_ID);
  if (iframeElement && iframeExists()) {
    iframeElement.remove();
    document.removeEventListener('click', handleClickAway);
  }
};

function getOrigin() {
  const overrideUrl = localStorage.getItem('FIGURE_HOSTED_WALLET_URL_TEST_OVERRIDE');
  const windowUrl = new URL(overrideUrl ?? `${FIGURE_HOSTED_WALLET_URL_TEST}`);
  return windowUrl;
}

function handleClickAway(e: MouseEvent) {
  console.log('document click called, closing iframe', e);
  removeIframe();
}

// Add ability for dApp/website to send a message to this extension
const createIframe = (url: string) => {
  // Remove any existing iframes on this window
  removeIframe();

  // TODO: close iframe in other windows/tabs

  // Create div container
  const container = document.createElement('div');
  container.id = IFRAME_ID;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;

  // I don't think we need the allow, but may need it after testing some
  //iframe.allow = `clipboard-read ${EXTENSION_ORIGIN}/index.html#/notification;clipboard-write ${EXTENSION_ORIGIN}/index.html#/notification;`

  // Create stylesheet
  const style = document.createElement('style');
  style.textContent = `
      #${IFRAME_ID} {
        all: initial;
        width:${IFRAME_NOTIFICATION_WIDTH}px;
        height:${IFRAME_NOTIFICATION_HEIGHT}px;
        display: flex !important;
        align-items: start;
        justify-content: flex-end;
        position: fixed;
        top: 0px;
        right: 0px;
        z-index: 2147483647;
      }
  
      iframe {
        width:${IFRAME_NOTIFICATION_WIDTH}px;
        height:${IFRAME_NOTIFICATION_HEIGHT}px;
        right: 10px;
        top: 10px;
        position: fixed;
        border: none;
        box-shadow: 4px 4px 37px 3px rgb(0 0 0 / 40%), 0 0 1px 0 rgb(0 0 0 / 40%);
      }
    `;

  container.appendChild(style);
  container.appendChild(iframe);

  // Add iframe and style to the shadow
  document.body.appendChild(container);

  // Listen for the iframe to load, then focus it
  iframe.addEventListener('load', () => {
    iframe.focus();
    document.addEventListener('click', handleClickAway);
  });

  // Listen for any messages coming through
  // TODO: fix types for handler
  const handleIncomingMessage = ({ origin, data }: any) => {
    // Make sure the origin matches the extension
    if (origin === getOrigin()) {
      // The iframe wants us to close the extension iframe
      if (data && data.close) container.remove();
    }
  };
  // Create event listener for any messages
  window.addEventListener('message', handleIncomingMessage, false);
};

// Handle each specific notification event type
const catchWCJSMessage = ({ detail }: CustomEvent<EventData>) => {
  const { event, uri, duration, data, referral, address, redirectUrl } = detail;
  // Based on the event type handle what we do
  switch (event) {
    case 'resetConnectionTimeout': {
      // Data is going to be the new connectionTimeout in ms
      // Update the new EXP and Duration values
      //   const connectionDuration = data as number;
      //   const connectionEXP = Date.now() + connectionDuration;
      //   // Pull existing walletconnect storage data
      //   const existingWalletconnectStorage = (
      //     await window.chrome.storage.local.get('walletconnect')
      //   ).walletconnect;
      //   await window.chrome.storage.local.set({
      //     walletconnect: {
      //       ...existingWalletconnectStorage,
      //       connectionEXP,
      //       connectionDuration,
      //     },
      //   });
      break;
    }
    case 'walletconnect_event':
    case 'walletconnect_init': {
      console.log('Caught walletconnect_init, creating iframe');
      // Only create the iframe if one doesn't already exist (prevent accidental double clicking)
      if (!iframeExists()) {
        const overrideUrl = localStorage.getItem(
          'FIGURE_HOSTED_WALLET_URL_TEST_OVERRIDE'
        );
        const windowUrl = new URL(overrideUrl ?? `${FIGURE_HOSTED_WALLET_URL_TEST}`);
        if (uri) windowUrl.searchParams.append('wc', uri);
        if (address) windowUrl.searchParams.append('address', address);
        if (event) windowUrl.searchParams.append('event', event);
        if (redirectUrl) windowUrl.searchParams.append('redirectUrl', redirectUrl);
        console.log('iframe url generated', windowUrl.toString());
        createIframe(windowUrl.toString());
      }
      break;
    }
    case 'walletconnect_disconnect': {
      // TODO: update display to show disconnected state

      console.log('Received walletconnect_disconnect');
      removeIframe();

      // TODO: any additional cleanup on the Hosted Wallet side?
      break;
    }
    default:
      break;
  }
};

export function HostedWalletIframe() {
  useEffect(() => {
    document.addEventListener('figureWalletHostedSendMessage', (ev) => {
      catchWCJSMessage(ev as any); // NOTE: types not picking up correctly?
    });

    return () => {
      document.removeEventListener('figureWalletHostedSendMessage', (ev) => {
        catchWCJSMessage(ev as any); // NOTE: types not picking up correctly?
      });
    };
  }, []);

  return null;
}
