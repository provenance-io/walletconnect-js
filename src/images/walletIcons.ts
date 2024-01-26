import provenanceWalletImg from './provenance.svg';
import figureWalletImg from './figure.svg';
import figureMobileWalletImg from './figureMobileWalletIcon.png';
import chromeLogoImg from './chromeLogo.png';
import { WalletIcons } from '../types';

export const WALLET_ICONS: { [key in WalletIcons]: string } = {
  provenance: provenanceWalletImg,
  figure: figureWalletImg,
  figureMobile: figureMobileWalletImg,
  chromeLogo: chromeLogoImg,
};
