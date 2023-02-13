import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { WalletConnectService } from '../../services';
import {
  APP_STORE_GOOGLE_PLAY_FIGURE,
  APP_STORE_APPLE_FIGURE,
  WALLET_LIST,
} from '../../consts';
import appleAppStoreImg from '../../images/appStoreBadge.svg';
import googlePlayImg from '../../images/googlePlayBadge.png';
import { WALLET_ICONS } from '../../images';
import { Wallet, EventData, WalletId } from '../../types';
import {
  QRCodeModalContainer,
  QRModalContent,
  CloseQRModal,
  Toggle,
  ToggleNotch,
  Text,
  CopyButton,
  ImgContainer,
  WalletRow,
  WalletRowNonLink,
  WalletTitle,
  WalletIcon,
  AppStoreIcons,
  AppIcon,
  ReloadNotice,
} from './QRCodeModalStyles';

interface Props {
  className?: string;
  walletConnectService: WalletConnectService;
  title?: string;
  devWallets?: WalletId[]; // Dev mode Wallet-ids to render (hidden by default)
  hideWallets?: WalletId[]; // Prod mode Wallet-ids to hide (visible by default)
}

export const QRCodeModal: React.FC<Props> = ({
  className,
  walletConnectService: wcs,
  title = 'Scan the QRCode with your mobile Provenance Blockchain Wallet.',
  devWallets,
  hideWallets,
}) => {
  const { state } = wcs;
  const { connectionTimeout, modal } = state;
  const { isMobile, showModal, QRCode, QRCodeUrl } = modal;
  const options = ['qr', isMobile ? 'mobile' : 'desktop'];
  // Which tab of the popup is currently open (qr/desktop/mobile)
  const [view, setView] = useState('qr');
  // Copy the QR code value as a string
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState<number>(-1);
  // Display a message to the user that a reload is required
  const [showReloadNotice, setShowReloadNotice] = useState(false);
  const encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
  // On unload, remove any running 'copied' timeoutInstances (prevent memory leaks)
  useEffect(
    () => () => {
      if (timeoutInstance) clearTimeout(timeoutInstance);
    },
    [timeoutInstance]
  );
  // -----------------------------------------------------------------------------------------------
  // Ability to copy the QR code to the clipboard as a string (success message has a timeout)
  // -----------------------------------------------------------------------------------------------
  const copyToClipboard = () => {
    navigator.clipboard.writeText(encodedQRCodeUrl).then(() => {
      clearTimeout(timeoutInstance);
      setCopied(true);
      const newTimeoutInstance = window.setTimeout(() => {
        setCopied(false);
      }, 3000);
      setTimeoutInstance(newTimeoutInstance);
    });
  };
  // -----------------------------------------------
  // Build the QR Code and mobile download view
  // -----------------------------------------------
  const renderQRView = () => (
    <>
      <Text className="wcjs-qr-text">{title}</Text>
      <ImgContainer className="wcjs-qr-img">
        <img src={QRCode} alt="WalletConnect QR Code" />
      </ImgContainer>
      {copied ? (
        <CopyButton disabled className="wcjs-qr-copy">
          QR Code Copied
        </CopyButton>
      ) : (
        <CopyButton onClick={copyToClipboard} className="wcjs-qr-copy">
          Copy QR Code
        </CopyButton>
      )}
      <Text className="wcjs-qr-text">Download Figure Mobile Wallet</Text>
      <AppStoreIcons className="wcjs-qr-appicons">
        <AppIcon
          href={APP_STORE_APPLE_FIGURE}
          target="_blank"
          rel="no-referrer"
          title="Get the Figure Wallet in the Apple App store."
        >
          <img src={appleAppStoreImg} height="42px" alt="Apple App Store badge" />
        </AppIcon>
        <AppIcon
          href={APP_STORE_GOOGLE_PLAY_FIGURE}
          target="_blank"
          rel="no-referrer"
          title="Get the Figure Wallet in the Google Play store."
        >
          <img src={googlePlayImg} height="42px" alt="Google Play Store badge" />
        </AppIcon>
      </AppStoreIcons>
    </>
  );
  // ----------------------------------------
  // Use clicks one of the desktop wallets
  // ----------------------------------------
  const handleDesktopWalletClick = (event: React.MouseEvent, wallet: Wallet) => {
    const runEventAction = () => {
      // If the wallet has an eventAction (they should all have an event action...)
      if (wallet.eventAction) {
        // Set the name of the wallet into the walletconnect-js state (to use as a reference)
        // If a custom extension ID has been set, note it (need to handle this better)
        wcs.setWalletAppId(wallet.id);
        // Build eventdata to send to the extension
        const eventData: EventData = {
          uri: encodedQRCodeUrl,
          event: 'walletconnect_init',
          duration: connectionTimeout,
          redirectUrl: window.location.href,
        };
        // Trigger the event action based on the wallet
        wallet.eventAction(eventData);
      }
    };
    // Wallet includes a self-existence check function
    if (wallet.walletCheck) {
      // Use function to see if wallet exists
      const walletExists = wallet.walletCheck();
      // Wallet exists, run the proper event action
      if (walletExists) runEventAction();
      // Wallet doesn't exist, send the user to the wallets download url (if provided)
      else if (wallet.walletUrl) {
        window.open(wallet.walletUrl);
        setShowReloadNotice(true);
      }
    } else {
      // No self-existence check required, just run the event action for this wallet
      runEventAction();
    }
  };

  // -------------------------------
  // Build all the desktop wallets
  // -------------------------------
  const buildDesktopWallets = () =>
    WALLET_LIST
      // Pull out all web/extension wallets.
      // If they are in dev mode we don't render them unless they're included in the devWallets override array
      .filter(
        ({ type, dev, id }) =>
          // Has to either be a web or extension wallet
          (type.includes('web') || type.includes('extension')) &&
          // Not dev, or if dev, included in devWallets list
          (!dev || devWallets?.includes(id)) &&
          // Cannot be included in hideWallets list
          !hideWallets?.includes(id)
      )
      .map((wallet: Wallet) => {
        const { id, icon, title: walletTitle } = wallet;
        return (
          <WalletRowNonLink
            onClick={(e) => handleDesktopWalletClick(e, wallet)}
            key={id}
            className="wcjs-qr-row-nonlink"
          >
            {!!icon && (
              <WalletIcon src={WALLET_ICONS[icon]} className="wcjs-qr-icon" />
            )}
            <WalletTitle className="wcjs-qr-title">{walletTitle}</WalletTitle>
          </WalletRowNonLink>
        );
      });
  // ------------------------------------------------------------------
  // For every built mobile dynamic link, build out the wallet row
  // ------------------------------------------------------------------
  const buildMobileWallets = () =>
    WALLET_LIST
      // Pull out all mobile wallets.
      // If they are in dev mode we don't render them unless they're included in the devWallets override array
      .filter(
        ({ type, dev, id }) =>
          // Has to either be a web or extension wallet
          type.includes('mobile') &&
          // Not dev, or if dev, included in devWallets list
          (!dev || devWallets?.includes(id)) &&
          // Cannot be included in hideWallets list
          !hideWallets?.includes(id)
      )
      .map((wallet) => {
        const { title: walletTitle, icon, id, generateUrl } = wallet;
        const dynamicLink = generateUrl ? generateUrl(QRCode) : '';
        return (
          <WalletRow
            className="wcjs-qr-row"
            href={dynamicLink}
            rel="noopener noreferrer"
            target="_blank"
            key={id}
            onClick={() => {
              // Update the walletAppId value to be this mobile wallet id
              wcs.setWalletAppId(wallet.id);
            }}
          >
            {!!icon && (
              <WalletIcon src={WALLET_ICONS[icon]} className="wcjs-qr-icon" />
            )}
            <WalletTitle className="wcjs-qr-title">{walletTitle}</WalletTitle>
          </WalletRow>
        );
      });
  const DesktopWalletsList = buildDesktopWallets();

  return showModal ? (
    <QRCodeModalContainer
      className={className}
      id="wcjs-qr-modal"
      onClick={() => wcs.updateModal({ showModal: false })}
    >
      <QRModalContent
        onClick={(e) => e.stopPropagation()}
        className="wcjs-qr-content"
      >
        <CloseQRModal
          onClick={() => wcs.updateModal({ showModal: false })}
          className="wcjs-qr-close"
        >
          <svg
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            height="1.4rem"
          >
            <path d="M8.99984 1L5.09375 5L8.99984 9" />
            <path d="M1.00016 1L4.90625 5L1.00016 9" />
          </svg>
        </CloseQRModal>
        <Toggle className="wcjs-qr-toggle">
          {options.includes('qr') && (
            <ToggleNotch
              active={view === 'qr'}
              onClick={() => setView('qr')}
              className={`wcjs-qr-notch ${view === 'qr' ? 'active' : ''}`}
            >
              QR Code
            </ToggleNotch>
          )}
          {options.includes('desktop') && (
            <ToggleNotch
              active={view === 'desktop'}
              onClick={() => setView('desktop')}
              className={`wcjs-qr-notch ${view === 'desktop' ? 'active' : ''}`}
            >
              Desktop
            </ToggleNotch>
          )}
          {options.includes('mobile') && (
            <ToggleNotch
              active={view === 'mobile'}
              onClick={() => setView('mobile')}
              className={`wcjs-qr-notch ${view === 'mobile' ? 'active' : ''}`}
            >
              Mobile
            </ToggleNotch>
          )}
        </Toggle>
        {view === 'qr' ? (
          renderQRView()
        ) : (
          <Text className="wcjs-qr-text">Select wallet</Text>
        )}
        {view === 'desktop' && (
          <>
            {!!showReloadNotice && (
              <ReloadNotice className="wcjs-qr-reload">
                <CloseQRModal
                  onClick={() => setShowReloadNotice(false)}
                  className="wcjs-qr-close"
                >
                  <svg
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    height="1.4rem"
                  >
                    <path d="M8.99984 1L5.09375 5L8.99984 9" />
                    <path d="M1.00016 1L4.90625 5L1.00016 9" />
                  </svg>
                </CloseQRModal>
                <Text className="wcjs-qr-text">
                  Note: You must reload this page after installing the Provenance
                  Blockchain Wallet extension.
                </Text>
                <button onClick={() => setShowReloadNotice(false)}>Back</button>
                <button onClick={() => window.location.reload()}>Reload</button>
              </ReloadNotice>
            )}
            {DesktopWalletsList.length ? (
              DesktopWalletsList
            ) : (
              <Text className="wcjs-qr-text">
                No desktop wallets currently available.
              </Text>
            )}
          </>
        )}
        {view === 'mobile' && buildMobileWallets()}
      </QRModalContent>
    </QRCodeModalContainer>
  ) : null;
};
