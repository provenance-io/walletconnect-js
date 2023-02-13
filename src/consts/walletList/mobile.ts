import { Wallet } from '../../types';
import {
  DYNAMIC_LINK_FIGURE_MOBILE_URL,
  FIGURE_MOBILE_WALLET_CONNECT_URL,
  FIGURE_MOBILE_WALLET_APP_ID,
  FIGURE_MOBILE_WALLET_APP_ID_TEST,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST,
} from '../urls';
import { WALLET_APP_IDS } from '../walletAppIds';

export const mobileFigure = {
  id: WALLET_APP_IDS.FIGURE_MOBILE,
  type: 'mobile',
  title: 'Figure Mobile',
  icon: 'figure',
  generateUrl: (QRCodeUrl) => {
    const doubleEncodedWCData = encodeURIComponent(encodeURIComponent(QRCodeUrl));
    const finalUrl = new URL(DYNAMIC_LINK_FIGURE_MOBILE_URL);
    const linkParam = `${FIGURE_MOBILE_WALLET_CONNECT_URL}?data=${doubleEncodedWCData}`;
    const apnParam = FIGURE_MOBILE_WALLET_PACKAGE_NAME;
    const ibiParam = FIGURE_MOBILE_WALLET_PACKAGE_NAME;
    const isiParam = FIGURE_MOBILE_WALLET_APP_ID;
    const efrParam = '1';
    finalUrl.searchParams.append('link', linkParam);
    finalUrl.searchParams.append('apn', apnParam);
    finalUrl.searchParams.append('ibi', ibiParam);
    finalUrl.searchParams.append('isi', isiParam);
    finalUrl.searchParams.append('efr', efrParam);
    return finalUrl.toString();
  },
} as Wallet;

export const mobileFigureTest = {
  id: WALLET_APP_IDS.FIGURE_MOBILE_TEST,
  type: 'mobile',
  title: 'Figure Mobile (Test)',
  icon: 'figure',
  generateUrl: (QRCodeUrl) => {
    const doubleEncodedWCData = encodeURIComponent(encodeURIComponent(QRCodeUrl));
    const finalUrl = new URL(DYNAMIC_LINK_FIGURE_MOBILE_URL);
    const linkParam = `${FIGURE_MOBILE_WALLET_CONNECT_URL}?data=${doubleEncodedWCData}`;
    const apnParam = FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST;
    const ibiParam = FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST;
    const isiParam = FIGURE_MOBILE_WALLET_APP_ID_TEST;
    const efrParam = '1';
    finalUrl.searchParams.append('link', linkParam);
    finalUrl.searchParams.append('apn', apnParam);
    finalUrl.searchParams.append('ibi', ibiParam);
    finalUrl.searchParams.append('isi', isiParam);
    finalUrl.searchParams.append('efr', efrParam);
    return finalUrl.toString();
  },
} as Wallet;
