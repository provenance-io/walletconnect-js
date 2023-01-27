export const DYNAMIC_LINK_INFO_PROD_PROVENANCE = {
  domainUriPrefix: 'https://provenancewallet.page.link',
  link: `https://provenance.io/wallet-connect`,
  androidInfo: {
    androidPackageName: 'io.provenance.wallet',
  },
  iosInfo: {
    iosBundleId: 'io.provenance.wallet',
    iosAppStoreId: '1606428494',
  },
  navigationInfo: {
    enableForcedRedirect: true,
  },
};

export const DYNAMIC_LINK_INFO_DEV_PROVENANCE = {
  domainUriPrefix: 'https://provenancewallet.page.link',
  link: `https://provenance.io/wallet-connect`,
  androidInfo: {
    androidPackageName: 'io.provenance.wallet.dev',
  },
  iosInfo: {
    iosBundleId: 'io.provenance.wallet.dev',
    iosAppStoreId: '1612125955',
  },
  navigationInfo: {
    enableForcedRedirect: true,
  },
};

export const DYNAMIC_LINK_INFO_PROD_FIGURE = {
  domainUriPrefix: 'https://figurewallet.page.link',
  link: `https://figure.com/wallet-connect?data=$encodedWalletConnectData`,
  androidInfo: {
    androidPackageName: 'com.figure.mobile.wallet',
  },
  iosInfo: {
    iosBundleId: 'com.figure.mobile.wallet',
    iosAppStoreId: '6444263900',
  },
  navigationInfo: {
    enableForcedRedirect: true,
  },
};

export const DYNAMIC_LINK_INFO_DEV_FIGURE = {
  domainUriPrefix: 'https://figurewallet.page.link',
  link: `https://figure.com/wallet-connect?data=$encodedWalletConnectData`,
  androidInfo: {
    androidPackageName: 'com.figure.mobile.wallet.dev',
  },
  iosInfo: {
    iosBundleId: 'com.figure.mobile.wallet.dev',
    iosAppStoreId: '6444293331',
  },
  navigationInfo: {
    enableForcedRedirect: true,
  },
};
