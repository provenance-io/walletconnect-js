import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { WalletConnectService } from '../../services';
import {
  PLUGIN_PROVENANCE_WALLET,
  APP_STORE_GOOGLE_PLAY,
  APP_STORE_APPLE,
  WALLET_LIST,
} from '../../consts';
import appleAppStoreImg from '../../images/appStoreBadge.svg';
import googlePlayImg from '../../images/googlePlayBadge.png';
import { WALLET_ICONS } from '../../images';
import { Wallet, EventData } from '../../types';

const QRCodeModalContainer = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.50);
  color: #444444;
  z-index: 1000;
`;
const QRModalContent = styled.div`
  /* min-height: 400px; */
  width: 400px;
  transition: 1s all;
  position: relative;
  border-radius: 10px;
  background: #EEEEEE;
  padding: 40px;
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.25);
`;
const CloseQRModal = styled.div`
  background: #FFFFFF;
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
  background: #DDDDDD;
  margin-bottom: 20px;
`;
const ToggleNotch = styled.div<{active?: boolean}>`
  color: #5588DD;
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
const Text = styled.p<{link?: boolean}>`
  font-size: 1.6rem;
  margin: 0;
  ${({ link }) => link && `
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
    background: #FFFFFF;
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
    background: #FFFFFF;
  }
`;
const WalletTitle = styled.div<{custom?: boolean}>`
  font-weight: 900;
  font-size: 2rem;
  color: ${({ custom }) => custom ? '#4889fa' : '#333333' };
  user-select: none;
`;
const WalletIcon = styled.img`
  background: #FFFFFF;
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

interface Props {
  className: string,
  walletConnectService: WalletConnectService,
  title: string
}

export const QRCodeModal:React.FC<Props> = ({
  className,
  walletConnectService: wcs,
  title = 'Scan the QRCode with your mobile Provenance Blockchain Wallet.',
}) => {
  const { state } = wcs;
  const { showQRCodeModal, QRCode, QRCodeUrl, isMobile } = state;
  const encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
  const options = ['qr', isMobile ? 'mobile' : 'desktop'];
  // Which tab of the popup is currently open (qr/desktop/mobile)
  const [view, setView] = useState('qr');
  // User defined custom extension ID (Used for local testing of extensions)
  const [customExtId, setCustomExtId] = useState('');
  const [showCustomExtId, setShowCustomExtId] = useState(false);
  // Has the customExt ID changed from what we expected it to be?
  const customProvExtId = customExtId && customExtId !== PLUGIN_PROVENANCE_WALLET;
  // Copy the QR code value as a string
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState<number>(-1);
  // List of mobile wallets after their dynamic links have been fetched (async)
  const [mobileWallets, setMobileWallets] = useState<Wallet[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  // On unload, remove any running 'copied' timeoutInstances (prevent memory leaks)
  useEffect(() => () => { if (timeoutInstance) clearTimeout(timeoutInstance); }, [timeoutInstance]);
  // --------------------------------------------
  // Build all the mobile wallet dynamic links
  // --------------------------------------------
  // When a user visits the site on mobile, they will get a "mobile" tab instead of "desktop"
  // The links to those "mobile wallets" are dynamic (iOS vs Android).  To get the links we must fetch
  useEffect(() => {
    const asyncBuildMobileWallets = () => WALLET_LIST
    .filter(({ type }) => type === 'mobile')
    .map(async (wallet) => {
      // All mobile wallets should have a generateUrl function, but double check
      if (wallet.generateUrl) {
        const dynamicUrl = await wallet.generateUrl(QRCodeUrl);
        // Add this wallet to the state wallet list with this generated url
        const allMobileWallets = [...mobileWallets, { ...wallet, dynamicUrl }];
        setMobileWallets(allMobileWallets);
      } 
    });
    // Only run this when the modal is open and once for each wallet
    if (showQRCodeModal && initialLoad) {
      setInitialLoad(false);
      asyncBuildMobileWallets();
    }
  }, [QRCodeUrl, mobileWallets, initialLoad, showQRCodeModal]);
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
      <Text>{title}</Text>
      <ImgContainer>
        <img src={QRCode} alt="WalletConnect QR Code" />
      </ImgContainer>
      { copied ? <CopyButton disabled>QR Code Copied</CopyButton> : <CopyButton onClick={copyToClipboard}>Copy QR Code</CopyButton> }
      <Text>Download Provenance Mobile Wallet</Text>
      <AppStoreIcons>
        <AppIcon href={APP_STORE_APPLE} target="_blank" rel="no-referrer" title="Get the Provenance Blockchain Wallet in the Apple App store.">
          <img src={appleAppStoreImg} height="42px" alt="Apple App Store badge" />
        </AppIcon>
        <AppIcon href={APP_STORE_GOOGLE_PLAY} target="_blank" rel="no-referrer" title="Get the Provenance Blockchain Wallet in the Google Play store.">
          <img src={googlePlayImg}  height="42px" alt="Google Play Store badge" />
        </AppIcon>
      </AppStoreIcons>
    </>
  );
  // ----------------------------------------
  // Use clicks one of the desktop wallets
  // ----------------------------------------
  const handleDesktopWalletClick = (event:React.MouseEvent, wallet: Wallet) => {
    // Does the user want to pass a custom extension id (pressing 'shift' when clicking button)?
    if (wallet.type === 'extension' && event.shiftKey) {
      // Already showing the custom extension id, reset it
      if (showCustomExtId) setCustomExtId(''); // reset value when closing
      // Toggle showing the extension id (if shown, hide, vice-versa)
      setShowCustomExtId(!showCustomExtId);
    }
    // If the wallet has an eventAction (they should all have an event action...)
    else if (wallet.eventAction) {
      // Set the name of the wallet into the walletconnect-js state (to use as a reference)
      // If a custom extension ID has been set, note it (need to handle this better)
      wcs.setState({ walletApp: wallet.id, customExtId });
      // Build eventdata to send to the extension
      const eventData: EventData = { uri: encodedQRCodeUrl, event: 'walletconnect_init', customExtId };
      // Trigger the event action based on the wallet
      wallet.eventAction(eventData);
    }
  };
  // -------------------------------
  // Build all the desktop wallets
  // -------------------------------
  const buildDesktopWallets = () => WALLET_LIST
    .filter(({ type }) => type === 'web' || type === 'extension')
    .map((wallet) => {
    const { type, id, icon, title: walletTitle } = wallet;
    const isExtension = type === 'extension';
    return (
      <WalletRowNonLink onClick={(e) => handleDesktopWalletClick(e, wallet)} key={id}>
        {!!icon && <WalletIcon src={WALLET_ICONS[icon]} />}
        <WalletTitle custom={isExtension && !!customProvExtId}>
          {walletTitle} {customProvExtId && isExtension && '(Custom ID)'}
          {showCustomExtId && isExtension && (
          <input
            value={customExtId}
            placeholder="Custom Extension ID"
            onChange={({ target }) => {
              setCustomExtId(target.value)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        </WalletTitle>
      </WalletRowNonLink>
    )
  });
  // ------------------------------------------------------------------
  // For every built mobile dynamic link, build out the wallet row
  // ------------------------------------------------------------------
  const buildMobileWallets = () => mobileWallets.map(wallet => {
    const { dynamicUrl, title: walletTitle, icon, id } = wallet;
    if (dynamicUrl) {
      return (
        <WalletRow
          href={dynamicUrl}
          rel="noopener noreferrer"
          target="_blank"
          key={id}
          onClick={() => {
            // Update the walletApp value to be this mobile wallet id
            wcs.setState({ walletApp: wallet.id });
          }}
        >
          {!!icon && <WalletIcon src={WALLET_ICONS[icon]} />}
          <WalletTitle>{walletTitle}</WalletTitle>
        </WalletRow>
      )
    } return <text>Unable to fetch {walletTitle} link. Please try again later.</text>;
  });

  return showQRCodeModal ? (
    <QRCodeModalContainer className={className} onClick={() => wcs.showQRCode(false)}>
      <QRModalContent onClick={(e) => e.stopPropagation()}>
        <CloseQRModal onClick={() => wcs.showQRCode(false)}>
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" height="1.4rem">
          <path d="M8.99984 1L5.09375 5L8.99984 9" />
          <path d="M1.00016 1L4.90625 5L1.00016 9" />
        </svg>
        </CloseQRModal>
        <Toggle>
          {options.includes('qr') && <ToggleNotch active={view === 'qr'} onClick={() => setView('qr')}>QR Code</ToggleNotch>}
          {options.includes('desktop') && <ToggleNotch active={view === 'desktop'} onClick={() => setView('desktop')}>Desktop</ToggleNotch>}
          {options.includes('mobile') && <ToggleNotch active={view === 'mobile'} onClick={() => setView('mobile')}>Mobile</ToggleNotch>}
        </Toggle>
        { view === 'qr' ? renderQRView() : <Text>Select wallet</Text>}
        { view === 'desktop' && buildDesktopWallets() }
        { view === 'mobile' && buildMobileWallets() }
      </QRModalContent>
    </QRCodeModalContainer>
  ) : null;
};
