import provenanceWalletImg from './provenance.svg';
import figureWalletImg from './figure.svg';
import unicornWalletImg from './unicorn.png';
import { WalletIcons } from '../types';

export const WALLET_ICONS: { [key in WalletIcons]: string } = {
  provenance: provenanceWalletImg,
  figure: figureWalletImg,
  unicorn: unicornWalletImg,
};
