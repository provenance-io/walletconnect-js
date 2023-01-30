import { Wallet } from '../../types';
import {
  FIREBASE_FETCH_WALLET_URL_FIGURE,
  FIREBASE_FETCH_WALLET_URL_PROVENANCE,
} from '../urls';
import {
  DYNAMIC_LINK_INFO_PROD_FIGURE,
  DYNAMIC_LINK_INFO_TEST_FIGURE,
  DYNAMIC_LINK_INFO_PROD_PROVENANCE,
  DYNAMIC_LINK_INFO_TEST_PROVENANCE,
} from '../dynamicLinkInfo';

export const mobileProvenance = {
  id: 'provenance_mobile',
  type: 'mobile',
  title: 'Provenance Mobile',
  icon: 'provenance',
  dev: true,
  generateUrl: async (QRCodeUrl) => {
    const url = FIREBASE_FETCH_WALLET_URL_PROVENANCE;
    const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
    const linkProd = `${DYNAMIC_LINK_INFO_PROD_PROVENANCE.link}?data=${linkData}`;
    // First fetch prod, then dev
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_PROD_PROVENANCE, link: linkProd },
      }),
    })
      .then((response) => response.json())
      .then(({ shortLink }) => shortLink)
      .catch(() => 'unavailable');
  },
} as Wallet;

export const mobileProvenanceTest = {
  id: 'provenance_mobile_test',
  type: 'mobile',
  title: 'Provenance Mobile (Test)',
  icon: 'provenance',
  dev: true,
  generateUrl: async (QRCodeUrl) => {
    const url = FIREBASE_FETCH_WALLET_URL_PROVENANCE;
    const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
    const linkProd = `${DYNAMIC_LINK_INFO_TEST_PROVENANCE.link}?data=${linkData}`;
    // First fetch prod, then dev
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_TEST_PROVENANCE, link: linkProd },
      }),
    })
      .then((response) => response.json())
      .then(({ shortLink }) => shortLink)
      .catch(() => 'unavailable');
  },
} as Wallet;

export const mobileFigure = {
  id: 'figure_mobile',
  type: 'mobile',
  title: 'Figure Mobile',
  icon: 'figure',
  generateUrl: async (QRCodeUrl) => {
    const url = FIREBASE_FETCH_WALLET_URL_FIGURE;
    const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
    const linkProd = `${DYNAMIC_LINK_INFO_PROD_FIGURE.link}?data=${linkData}`;
    // First fetch prod, then dev
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_PROD_FIGURE, link: linkProd },
      }),
    })
      .then((response) => response.json())
      .then(({ shortLink }) => shortLink)
      .catch(() => 'unavailable');
  },
} as Wallet;

export const mobileFigureTest = {
  id: 'figure_mobile_test',
  type: 'mobile',
  title: 'Figure Mobile (Test)',
  icon: 'figure',
  generateUrl: async (QRCodeUrl) => {
    const url = FIREBASE_FETCH_WALLET_URL_FIGURE;
    const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
    const linkProd = `${DYNAMIC_LINK_INFO_TEST_FIGURE.link}?data=${linkData}`;
    // First fetch prod, then dev
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_TEST_FIGURE, link: linkProd },
      }),
    })
      .then((response) => response.json())
      .then(({ shortLink }) => shortLink)
      .catch(() => 'unavailable');
  },
} as Wallet;
