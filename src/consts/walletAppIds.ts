import { WalletId } from '../types';

export const WALLET_APP_IDS = {
  FIGURE_EXTENSION: 'figure_extension',
  FIGURE_MOBILE: 'figure_mobile',
  FIGURE_MOBILE_TEST: 'figure_mobile_test',
  FIGURE_HOSTED: 'figure_hosted',
  FIGURE_HOSTED_TEST: 'figure_hosted_test',
} as const;

export const BROWSER_MESSAGE_WALLETS: WalletId[] = [WALLET_APP_IDS.FIGURE_EXTENSION];
