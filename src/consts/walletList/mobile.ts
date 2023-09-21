import { WCWallet } from '../../types';
import { generateDynamicUrl } from '../../utils';
import {
  DYNAMIC_LINK_FIGURE_MOBILE_URL,
  FIGURE_MOBILE_WALLET_APP_ID,
  FIGURE_MOBILE_WALLET_APP_ID_TEST,
  FIGURE_MOBILE_WALLET_CONNECT_URL,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST,
} from '../urls';
import { WALLET_IDS } from '../wallet';

export const FIGURE_MOBILE = {
  id: WALLET_IDS.FIGURE_MOBILE,
  type: 'walletconnect',
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
} as WCWallet;

export const FIGURE_MOBILE_TEST = {
  id: WALLET_IDS.FIGURE_MOBILE_TEST,
  type: 'walletconnect',
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
} as WCWallet;
