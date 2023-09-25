export const WALLET_IDS = {
  FIGURE_EXTENSION: 'figure_extension',
  FIGURE_MOBILE: 'figure_mobile',
  FIGURE_MOBILE_TEST: 'figure_mobile_test',
  FIGURE_HOSTED: 'figure_hosted',
  FIGURE_HOSTED_TEST: 'figure_hosted_test',
} as const;

export const WALLET_TYPES = {
  BROWSER: 'browser',
  WALLETCONNECT: 'walletconnect',
} as const;

export const WALLET_ICONS = {
  FIGURE: 'figure',
} as const;

export const BROWSER_WALLETS = [
  WALLET_IDS.FIGURE_EXTENSION,
  WALLET_IDS.FIGURE_HOSTED,
  WALLET_IDS.FIGURE_HOSTED_TEST,
] as const;
export const WC_WALLETS = [
  WALLET_IDS.FIGURE_MOBILE,
  WALLET_IDS.FIGURE_MOBILE_TEST,
] as const;
