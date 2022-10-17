"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DYNAMIC_LINK_INFO_PROD = exports.DYNAMIC_LINK_INFO_DEV = void 0;
var DYNAMIC_LINK_INFO_PROD = {
  domainUriPrefix: 'https://provenancewallet.page.link',
  link: "https://provenance.io/wallet-connect",
  androidInfo: {
    androidPackageName: 'io.provenance.wallet'
  },
  iosInfo: {
    iosBundleId: 'io.provenance.wallet',
    iosAppStoreId: '1606428494'
  },
  navigationInfo: {
    enableForcedRedirect: true
  }
};
exports.DYNAMIC_LINK_INFO_PROD = DYNAMIC_LINK_INFO_PROD;
var DYNAMIC_LINK_INFO_DEV = {
  domainUriPrefix: 'https://provenancewallet.page.link',
  link: "https://provenance.io/wallet-connect",
  androidInfo: {
    androidPackageName: 'io.provenance.wallet.dev'
  },
  iosInfo: {
    iosBundleId: 'io.provenance.wallet.dev',
    iosAppStoreId: '1612125955'
  },
  navigationInfo: {
    enableForcedRedirect: true
  }
};
exports.DYNAMIC_LINK_INFO_DEV = DYNAMIC_LINK_INFO_DEV;