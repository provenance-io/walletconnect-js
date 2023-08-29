import { useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { EventData } from 'types';
import {
  FIGURE_HOSTED_WALLET_URL_PROD,
  FIGURE_HOSTED_WALLET_URL_TEST,
  HOSTED_IFRAME_EVENT_TYPE,
  WALLET_APP_IDS,
} from '../consts';

const IFRAME_NOTIFICATION_HEIGHT = 600;
const IFRAME_NOTIFICATION_WIDTH = 600;
const IFRAME_ID = 'figure-wallet-hosted';

// Check if the iframe exists
const iframeExists = () => !!document.getElementById(IFRAME_ID);

// If the iframe element exists, remove it from the DOM
function removeIframe() {
  const iframeElement = document.getElementById(IFRAME_ID);
  if (iframeElement) {
    iframeElement.remove();
  }
}

function getOrigin(isProd: boolean) {
  if (isProd) {
    return new URL(FIGURE_HOSTED_WALLET_URL_PROD);
  }
  // TEST
  const overrideUrl = localStorage.getItem('FIGURE_HOSTED_WALLET_URL_TEST_OVERRIDE');
  const windowUrl = new URL(overrideUrl ?? `${FIGURE_HOSTED_WALLET_URL_TEST}`);
  return windowUrl;
}

function handleChannelMessage(event: MessageEvent<any>) {
  if (event.data.type === 'create_iframe') {
    removeIframe();
  }
}

// Create shared BroadcastChannel instance to prevent catching own
// events on same page from multiple iframe creations
const channel = new BroadcastChannel('figure-hosted-wallet');
channel.onmessage = handleChannelMessage;

// Add ability for dApp/website to send a message to this extension
const createIframe = (url: string) => {
  // Remove any existing iframes on this window
  removeIframe();

  // Create div container
  const container = document.createElement('div');
  container.id = IFRAME_ID;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;

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
      
      #${IFRAME_ID}.minimized {
        width: 50px;
        height: 50px;
        top: 50px;
        background-color: transparent
      }
      
      iframe {
        width:${IFRAME_NOTIFICATION_WIDTH}px;
        height:${IFRAME_NOTIFICATION_HEIGHT}px;
        margin: 10px;
        border: none;
        border-radius: 4px;
        box-shadow: 4px 4px 37px 3px rgb(0 0 0 / 40%), 0 0 1px 0 rgb(0 0 0 / 40%);
      }

      .minimized iframe {
        width: 50px;
        height: 50px;
        color-scheme: normal;
      }

      @media screen and (max-height: ${IFRAME_NOTIFICATION_HEIGHT}px) {
        #${IFRAME_ID} {
          height: auto;
          bottom: 0px;
          align-items: stretch;
        }

        iframe {
          height: auto;
        }
      }
    `;

  container.appendChild(style);
  container.appendChild(iframe);

  // Add iframe and style to the shadow
  document.body.appendChild(container);

  // Post message to BroadcastChannel to close other hosted wallet iframes (prevent corrupted state)
  channel.postMessage({ type: 'create_iframe' });

  // Listen for the iframe to load, then focus it
  iframe.addEventListener('load', () => {
    iframe.focus();
  });
};

// Handle each specific notification event type
const catchWCJSMessage = ({ detail }: CustomEvent<EventData>) => {
  const { event, uri, duration, data, referral, address, redirectUrl } = detail;
  // Based on the event type handle what we do
  switch (event) {
    case 'walletconnect_event':
    case 'walletconnect_init':
    case 'walletconnect_disconnect': {
      // Only create the iframe if one doesn't already exist (prevent accidental double clicking)
      if (iframeExists()) {
        return;
      }
      const windowUrl = getOrigin(detail.walletId === WALLET_APP_IDS.FIGURE_HOSTED);
      if (uri) windowUrl.searchParams.append('wc', uri);
      if (address) windowUrl.searchParams.append('address', address);
      if (event) windowUrl.searchParams.append('event', event);
      if (redirectUrl) windowUrl.searchParams.append('redirectUrl', redirectUrl);
      createIframe(windowUrl.toString());
      break;
    }
    default:
      break;
  }
};

export function useHostedWalletIframe() {
  useEffect(() => {
    document.addEventListener(HOSTED_IFRAME_EVENT_TYPE, (ev) => {
      catchWCJSMessage(ev as any); // NOTE: types not picking up correctly?
    });

    return () => {
      document.removeEventListener(HOSTED_IFRAME_EVENT_TYPE, (ev) => {
        catchWCJSMessage(ev as any); // NOTE: types not picking up correctly?
      });
    };
  }, []);

  function handleIframeMessage(event: MessageEvent<any>) {
    const acceptableOrigins = [
      new URL(FIGURE_HOSTED_WALLET_URL_PROD).origin,
      new URL(FIGURE_HOSTED_WALLET_URL_TEST).origin,
    ];
    const overrideUrl = localStorage.getItem(
      'FIGURE_HOSTED_WALLET_URL_TEST_OVERRIDE'
    );
    if (overrideUrl) {
      acceptableOrigins.push(new URL(overrideUrl).origin);
    }
    // Only listen for events coming from the hosted wallet origin
    if (!acceptableOrigins.includes(event.origin)) return;
    if (event.data === 'window_close') {
      removeIframe();
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);
}
