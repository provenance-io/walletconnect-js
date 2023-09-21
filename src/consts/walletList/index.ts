import { FullWallet } from '../../types';
import { FIGURE_EXTENSION } from './extension';
import { FIGURE_HOSTED, FIGURE_HOSTED_TEST } from './hosted';
import { FIGURE_MOBILE, FIGURE_MOBILE_TEST } from './mobile';

export const WALLET_LIST: FullWallet[] = [
  FIGURE_EXTENSION,
  FIGURE_MOBILE,
  FIGURE_MOBILE_TEST,
  FIGURE_HOSTED,
  FIGURE_HOSTED_TEST,
];
