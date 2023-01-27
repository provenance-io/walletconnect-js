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

const QRCodeModalContainer = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #444444;
  z-index: 1000;
`;
const QRModalContent = styled.div`
  width: 400px;
  transition: 1s all;
  position: relative;
  border-radius: 10px;
  background: #eeeeee;
  padding: 40px;
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.25);
`;
const CloseQRModal = styled.div`
  background: #ffffff;
  height: 24px;
  width: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Toggle = styled.div`
  padding: 4px;
  border-radius: 5px;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #dddddd;
  margin-bottom: 20px;
`;
const ToggleNotch = styled.div<{ active?: boolean }>`
  color: #5588dd;
  transition: 500ms all;
  padding: 4px 10px;
  font-weight: 700;
  ${({ active }) => active && 'background: #FFFFFF;'}
  flex-basis: 50%;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  user-select: none;
`;
const Text = styled.p<{ link?: boolean }>`
  font-size: 1.5rem;
  margin: 0;
  ${({ link }) =>
    link &&
    `
    color: #5588DD;
    cursor: pointer;
  `}
`;
const CopyButton = styled.button`
  font-size: 10px;
  margin: 0 28px 18px auto;
`;
const ImgContainer = styled.div`
  flex-basis: 100%;
  margin-top: 10px;
`;
const WalletRow = styled.a`
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  text-align: left;
  &:hover {
    background: #ffffff;
  }
`;
const WalletRowNonLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  text-align: left;
  cursor: pointer;
  input {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #aaaaaa;
    color: #444444;
  }
  &:hover {
    background: #ffffff;
  }
`;
const WalletTitle = styled.div<{ custom?: boolean }>`
  font-weight: 900;
  font-size: 2rem;
  color: ${({ custom }) => (custom ? '#4889fa' : '#333333')};
  user-select: none;
`;
const WalletIcon = styled.img`
  background: #ffffff;
  border-radius: 4px;
  height: 30px;
  width: 30px;
  margin-right: 20px;
  padding: 4px;
`;
const AppStoreIcons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
`;
const AppIcon = styled.a`
  margin: 0 6px;
`;
const ReloadNotice = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #eeeeee;
  padding: 60px 40px 40px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${Text} {
    margin-bottom: 34px;
  }
  button {
    margin-top: 6px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
    background: white;
  }
`;

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
  const { showQRCodeModal, QRCode, QRCodeUrl, isMobile, connectionTimeout } = state;
  const encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
  const options = ['qr', isMobile ? 'mobile' : 'desktop'];
  // Which tab of the popup is currently open (qr/desktop/mobile)
  const [view, setView] = useState('qr');
  // Copy the QR code value as a string
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState<number>(-1);
  // List of mobile wallets after their dynamic links have been fetched (async)
  const [mobileWallets, setMobileWallets] = useState<Wallet[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  // Display a message to the user that a reload is required
  const [showReloadNotice, setShowReloadNotice] = useState(false);
  // On unload, remove any running 'copied' timeoutInstances (prevent memory leaks)
  useEffect(
    () => () => {
      if (timeoutInstance) clearTimeout(timeoutInstance);
    },
    [timeoutInstance]
  );
  // --------------------------------------------
  // Build all the mobile wallet dynamic links
  // --------------------------------------------
  // When a user visits the site on mobile, they will get a "mobile" tab instead of "desktop"
  // The links to those "mobile wallets" are dynamic (iOS vs Android).  To get the links we must fetch
  useEffect(() => {
    // Get all mobile wallets
    const allMobileWallets = WALLET_LIST.filter(
      ({ type, dev, id }) =>
        // Has to be a mobile wallet
        type === 'mobile' &&
        // If a dev wallet, has to be included in devWallets list
        (!dev || devWallets?.includes(id)) &&
        // Cannot be included in hideWallets list
        !hideWallets?.includes(id)
    );
    // useEffect needs an async wrapper
    const asyncBuildMobileWallets = async () => {
      // Check each mobile wallet for a dynamic url (requires async API call to generate)
      const allWalletPromises = allMobileWallets.map(async (wallet) => {
        // Clone wallet to potentially add dynamicUrl
        const finalWallet = { ...wallet };
        // Some mobile wallets have a generateUrl function for a dynamic url
        if (wallet.generateUrl) {
          const dynamicUrl = await wallet.generateUrl(QRCodeUrl);
          // Add this wallet to the state wallet list with this generated url
          finalWallet.dynamicUrl = dynamicUrl;
        }
        return finalWallet;
      });
      const newMobileWallets = await Promise.all(allWalletPromises);
      // Update state value for all mobile wallets (api calls finished)
      setMobileWallets(newMobileWallets);
    };
    // Only run this when the modal is open
    if (showQRCodeModal && initialLoad) {
      setInitialLoad(false);
      // Only run if wallets exist
      if (allMobileWallets.length) asyncBuildMobileWallets();
    }
  }, [
    QRCodeUrl,
    mobileWallets,
    initialLoad,
    showQRCodeModal,
    devWallets,
    hideWallets,
  ]);
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
        wcs.setState({ walletAppId: wallet.id });
        // Build eventdata to send to the extension
        const eventData: EventData = {
          uri: encodedQRCodeUrl,
          event: 'walletconnect_init',
          duration: connectionTimeout,
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
          (type === 'web' || type === 'extension') &&
          // Not dev, or if dev, included in devWallets list
          (!dev || devWallets?.includes(id)) &&
          // Cannot be included in hideWallets list
          !hideWallets?.includes(id)
      )
      .map((wallet) => {
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
    mobileWallets.length ? (
      mobileWallets.map((wallet) => {
        const { dynamicUrl, title: walletTitle, icon, id, generateUrl } = wallet;
        // If we have a generateUrl w/the wallet, make sure we got a dynamicUrl
        if (generateUrl) {
          if (dynamicUrl) {
            return (
              <WalletRow
                className="wcjs-qr-row"
                href={dynamicUrl || ''}
                rel="noopener noreferrer"
                target="_blank"
                key={id}
                onClick={() => {
                  // Update the walletAppId value to be this mobile wallet id
                  wcs.setState({ walletAppId: wallet.id });
                }}
              >
                {!!icon && (
                  <WalletIcon src={WALLET_ICONS[icon]} className="wcjs-qr-icon" />
                )}
                <WalletTitle className="wcjs-qr-title">{walletTitle}</WalletTitle>
              </WalletRow>
            );
          }
          return (
            <Text className="wcjs-qr-text">
              Unable to fetch {walletTitle} link. Please try again later.
            </Text>
          );
        }
        // No generateUrl/dynamicUrl, just render the wallet with standard click functionality
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
      })
    ) : (
      <Text className="wcjs-qr-text">No mobile wallets currently available.</Text>
    );

  const DesktopWalletsList = buildDesktopWallets();

  return showQRCodeModal ? (
    <QRCodeModalContainer
      className={className}
      id="wcjs-qr-modal"
      onClick={() => wcs.showQRCode(false)}
    >
      <QRModalContent
        onClick={(e) => e.stopPropagation()}
        className="wcjs-qr-content"
      >
        <CloseQRModal
          onClick={() => wcs.showQRCode(false)}
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
