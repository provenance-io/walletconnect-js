import provenanceWalletImg from './provenance.svg';
import figureWalletImg from './figure.svg';
import { WalletIcons } from '../types';

export const WALLET_ICONS: { [key in WalletIcons]: string } = {
  provenance: provenanceWalletImg,
  figure: figureWalletImg,
};
