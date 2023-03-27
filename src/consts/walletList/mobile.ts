import { generateDynamicUrl } from '../../utils';
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

export const FIGURE_MOBILE = {
  id: WALLET_APP_IDS.FIGURE_MOBILE,
  type: 'mobile',
  title: 'Figure Mobile',
  icon: 'figure',
  generateUrl: (qRCodeUrl) =>
    generateDynamicUrl({
      qRCodeUrl,
      appId: FIGURE_MOBILE_WALLET_APP_ID,
      originUrl: DYNAMIC_LINK_FIGURE_MOBILE_URL,
      packageName: FIGURE_MOBILE_WALLET_PACKAGE_NAME,
      walletConnectUrl: FIGURE_MOBILE_WALLET_CONNECT_URL,
    }),
} as Wallet;

export const FIGURE_MOBILE_TEST = {
  id: WALLET_APP_IDS.FIGURE_MOBILE_TEST,
  type: 'mobile',
  title: 'Figure Mobile (Test)',
  icon: 'figure',
  generateUrl: (qRCodeUrl) =>
    generateDynamicUrl({
      qRCodeUrl,
      appId: FIGURE_MOBILE_WALLET_APP_ID_TEST,
      originUrl: DYNAMIC_LINK_FIGURE_MOBILE_URL,
      packageName: FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST,
      walletConnectUrl: FIGURE_MOBILE_WALLET_CONNECT_URL,
    }),
} as Wallet;
