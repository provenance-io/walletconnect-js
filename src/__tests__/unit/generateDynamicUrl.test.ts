import {
  DYNAMIC_LINK_FIGURE_MOBILE_URL,
  FIGURE_MOBILE_WALLET_CONNECT_URL,
  FIGURE_MOBILE_WALLET_APP_ID,
  FIGURE_MOBILE_WALLET_APP_ID_TEST,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME,
  FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST,
} from '../../consts';
import { generateDynamicUrl } from '../../utils';

const urlDataArray = [
  // PRODUCTION URL
  {
    dataType: 'Production Url',
    appId: FIGURE_MOBILE_WALLET_APP_ID,
    originUrl: DYNAMIC_LINK_FIGURE_MOBILE_URL,
    packageName: FIGURE_MOBILE_WALLET_PACKAGE_NAME,
    qRCodeUrl:
      'wc%3A94028ac0-eef7-4a87-a910-065cf3b75bfe%401%3Fbridge%3Dwss%253A%252F%252Fwww.figure.tech%252Fservice-wallet-connect-bridge%252Fws%252Fexternal%26key%3D46efe12f61e37964ab05782ce373b736e1ece635f1da6f55d619d1a5876bc256',
    walletConnectUrl: FIGURE_MOBILE_WALLET_CONNECT_URL,
    result:
      'https://figurewallet.page.link?link=https%253A%252F%252Ffigure.com%252Fwallet-connect%253Fdata%253Dwc%25253A94028ac0-eef7-4a87-a910-065cf3b75bfe%2525401%25253Fbridge%25253Dwss%2525253A%2525252F%2525252Fwww.figure.tech%2525252Fservice-wallet-connect-bridge%2525252Fws%2525252Fexternal%252526key%25253D46efe12f61e37964ab05782ce373b736e1ece635f1da6f55d619d1a5876bc256&apn=com.figure.mobile.wallet&ibi=com.figure.mobile.wallet&isi=6444263900&efr=1',
  },
  // TEST URL
  {
    dataType: 'Test Url',
    appId: FIGURE_MOBILE_WALLET_APP_ID_TEST,
    originUrl: DYNAMIC_LINK_FIGURE_MOBILE_URL,
    packageName: FIGURE_MOBILE_WALLET_PACKAGE_NAME_TEST,
    qRCodeUrl:
      'wc%3A94028ac0-eef7-4a87-a910-065cf3b75bfe%401%3Fbridge%3Dwss%253A%252F%252Fwww.figure.tech%252Fservice-wallet-connect-bridge%252Fws%252Fexternal%26key%3D46efe12f61e37964ab05782ce373b736e1ece635f1da6f55d619d1a5876bc256',
    walletConnectUrl: FIGURE_MOBILE_WALLET_CONNECT_URL,
    result:
      'https://figurewallet.page.link?link=https%253A%252F%252Ffigure.com%252Fwallet-connect%253Fdata%253Dwc%25253A94028ac0-eef7-4a87-a910-065cf3b75bfe%2525401%25253Fbridge%25253Dwss%2525253A%2525252F%2525252Fwww.figure.tech%2525252Fservice-wallet-connect-bridge%2525252Fws%2525252Fexternal%252526key%25253D46efe12f61e37964ab05782ce373b736e1ece635f1da6f55d619d1a5876bc256&apn=com.figure.mobile.wallet.dev&ibi=com.figure.mobile.wallet.dev&isi=6444293331&efr=1',
  },
];

describe('Generate a dynamic mobile urls for production and test', () => {
  urlDataArray.forEach((urlData) => {
    const {
      appId,
      originUrl,
      packageName,
      qRCodeUrl,
      walletConnectUrl,
      dataType,
      result,
    } = urlData;
    test(`Valid dynamic mobile ${dataType} created`, () => {
      expect(
        generateDynamicUrl({
          appId,
          originUrl,
          packageName,
          qRCodeUrl,
          walletConnectUrl,
        })
      ).toBe(result);
    });
  });
});
