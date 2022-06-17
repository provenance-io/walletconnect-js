import { WalletList } from '../types';
import { PLUGIN_PROVENANCE_WALLET, FIREBASE_FETCH_WALLET_URL, FIGURE_WEB_WALLET_URL } from './urls';
import { DYNAMIC_LINK_INFO_PROD } from './dynamicLinkInfo';

export const WALLET_LIST: WalletList = [
  {
    id: 'provenance_mobile',
    type: 'mobile',
    title: 'Provenance Wallet',
    icon: 'provenance',
    generateUrl: async (QRCodeUrl) => {
      const url = FIREBASE_FETCH_WALLET_URL;
      const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
      const linkProd = `${DYNAMIC_LINK_INFO_PROD.link}?data=${linkData}`;
      // First fetch prod, then dev
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({ dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_PROD, link: linkProd } })
      })
      .then((response) => response.json())
      .then(({ shortLink }) => shortLink)
      .catch(() => 'unavailable');
    },
  },
  {
    dev: true,
    id: 'provenance_extension',
    type: 'extension',
    title: 'Provenance Wallet',
    icon: 'provenance',
    extensionId: PLUGIN_PROVENANCE_WALLET,
    eventAction: (eventData) => {
      // Allow users to pass their own custom extension ID (for testing)
      const { customExtId } = eventData;
      const extensionId = customExtId ? customExtId : PLUGIN_PROVENANCE_WALLET
      window?.chrome?.runtime?.sendMessage(extensionId, eventData);
    },
  },
  {
    dev: true,
    id: 'figure_web',
    type: 'web',
    title: 'Figure Wallet',
    icon: 'figure',
    eventAction: ({ uri, address, event }) => {
      // Build a full set of urlSearchParams to append to the url
      const searchParams = new URLSearchParams();
      if (uri) searchParams.append('wc', uri);
      if (address) searchParams.append('address', address);
      if (event) searchParams.append('event', event);
      const searchParamsString = searchParams.toString();
      const url = `${FIGURE_WEB_WALLET_URL}${searchParamsString ? `?${searchParamsString}` : ''}`;
      const width = 600;
      const height = window.outerHeight < 750 ? window.outerHeight : 550;
      const top = window.outerHeight / 2 + window.screenY - height / 2;
      const left = window.outerWidth / 2 + window.screenX - width / 2;
      const windowOptions = `popup=1 height=${height} width=${width} top=${top} left=${left} resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1`;
      window.open(url, undefined, windowOptions);
    },
  },
];
