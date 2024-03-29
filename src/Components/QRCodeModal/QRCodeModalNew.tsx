import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import { WalletConnectService } from '../../services';
import { WALLET_ICONS } from '../../images';
import { WalletId } from '../../types';
import './stylesNew.css';

interface Props {
  className?: string;
  walletConnectService: WalletConnectService;
  title?: string;
  subtitle?: string;
  visibleWallets?: WalletId[]; // Prod mode Wallet-ids to hide (visible by default)
  disabledWallets?: WalletId[]; // Wallets which will never be shown
  allowShowingHidden?: boolean;
}

export const QRCodeModal: React.FC<Props> = ({
  className,
  walletConnectService: wcs,
  title = 'Connect Wallet',
  subtitle = 'Choose a wallet type',
  allowShowingHidden = true,
  visibleWallets = ['figure_mobile'],
  disabledWallets = [],
}) => {
  const { state } = wcs;
  const { modal } = state;
  const { showModal, QRCodeImg } = modal;
  const MODAL_VIEW_STATES = ['selectWallet', 'figure_mobile'] as const;
  const [showHiddenWallets, setShowHiddenWallets] = useState(false);
  const [modalViewState, setModalViewState] =
    useState<typeof MODAL_VIEW_STATES[number]>('selectWallet');

  const showWallet = (walletId: WalletId) => {
    // Is the wallet in the "hidden" or "disabled" lists?
    const isInVisibleArray = visibleWallets.includes(walletId);
    const isInDisabledArray = disabledWallets.includes(walletId);
    // If the wallet is in the disabled list, return false
    if (isInDisabledArray) return false;
    // Wallet is not hidden, show it
    if (isInVisibleArray) return true;
    // Wallet is hidden and we allow showing hidden wallets
    if (!isInVisibleArray && allowShowingHidden && showHiddenWallets) return true;
    // Wallet is not allowed to be shown at this time
    return false;
  };

  const handleMobileWalletClick = (
    walletId: 'figure_mobile' | 'figure_mobile_test'
  ) => {
    setModalViewState('figure_mobile');
    wcs.setWalletAppId(walletId);
  };

  const walletSelectContent = (
    <div onClick={(e) => e.stopPropagation()} className="wcjs-qr-content">
      <p className="wcjs-modal-title">{title}</p>
      <div
        onClick={() => wcs.updateModal({ showModal: false })}
        className="wcjs-qr-close"
      >
        <svg
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          height="14px"
        >
          <path d="M8.99984 1L5.09375 5L8.99984 9" />
          <path d="M1.00016 1L4.90625 5L1.00016 9" />
        </svg>
      </div>
      <p className="wcjs-modal-subtitle">{subtitle}</p>
      {/*  Figure Mobile Wallet */}
      {showWallet('figure_mobile') && (
        <div
          className="wcjs-qr-wallet-button"
          onClick={() => handleMobileWalletClick('figure_mobile')}
        >
          <img src={WALLET_ICONS.figureMobile} className="wcjs-qr-icon" />
          <div className="wcjs-qr-title">Figure Mobile</div>
        </div>
      )}
      {showWallet('figure_mobile_test') && (
        <div
          className="wcjs-qr-wallet-button"
          onClick={() => handleMobileWalletClick('figure_mobile_test')}
        >
          <img src={WALLET_ICONS.figureMobile} className="wcjs-qr-icon" />
          <div className="wcjs-qr-title">Figure Mobile (dev)</div>
        </div>
      )}
      {/* Figure Account Wallet */}
      {showWallet('figure_hosted') && (
        <div className="wcjs-qr-wallet-button">
          <img src={WALLET_ICONS.figure} className="wcjs-qr-icon-figure-account" />
          <div className="wcjs-qr-title">Figure Account</div>
        </div>
      )}
      {showWallet('figure_hosted_test') && (
        <div className="wcjs-qr-wallet-button">
          <img src={WALLET_ICONS.figure} className="wcjs-qr-icon-figure-account" />
          <div className="wcjs-qr-title">Figure Account (test)</div>
        </div>
      )}
      {/* Figure Extension Wallet */}
      {showWallet('figure_extension') && (
        <div className="wcjs-qr-wallet-button">
          <img src={WALLET_ICONS.chromeLogo} className="wcjs-qr-icon" />
          <div className="wcjs-qr-title">Figure Chrome Extension</div>
        </div>
      )}
      {allowShowingHidden && !showHiddenWallets && (
        <p className="wcjs-qr-fineprint" onClick={() => setShowHiddenWallets(true)}>
          Looking for other Figure wallets? Click here.
        </p>
      )}
    </div>
  );

  const mobileWalletContent = (
    <div onClick={(e) => e.stopPropagation()} className="wcjs-qr-content">
      <div
        className="wcjs-modal-back"
        onClick={() => setModalViewState('selectWallet')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12">
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="M8.8 1.2 4 6l4.8 4.8"
          ></path>
        </svg>
      </div>
      <p className="wcjs-modal-subtitle">Scan the QR code to connect</p>
      <div
        onClick={() => wcs.updateModal({ showModal: false })}
        className="wcjs-qr-close"
      >
        <svg
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          height="14px"
        >
          <path d="M8.99984 1L5.09375 5L8.99984 9" />
          <path d="M1.00016 1L4.90625 5L1.00016 9" />
        </svg>
      </div>
      <div className="wcjs-qr-img">
        <img
          className="wcjs-qr-img-element"
          src={QRCodeImg}
          alt="WalletConnect QR Code"
          height="276px"
          width="276px"
        />
      </div>
    </div>
  );

  // Based on the view state, render the content shown in the modal
  const renderQRCodeModalView = () => {
    switch (modalViewState) {
      case 'figure_mobile':
        return mobileWalletContent;
      case 'selectWallet': // fallthrough
      default:
        return walletSelectContent;
    }
  };

  return showModal ? (
    <div
      className={className}
      id="wcjs-qr-modal"
      onClick={() => wcs.updateModal({ showModal: false })}
    >
      {renderQRCodeModalView()}
    </div>
  ) : null;
};
