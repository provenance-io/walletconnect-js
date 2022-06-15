import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { WalletConnectService } from '../../services';
import {
  PLUGIN_PROVENANCE_WALLET,
  FIREBASE_FETCH_WALLET_URL,
  DYNAMIC_LINK_INFO_PROD,
  APP_STORE_GOOGLE_PLAY,
  APP_STORE_APPLE,
} from '../../consts';
import provenanceSvg from '../../images/provenance.svg';
import appleAppStoreImg from '../../images/appStoreBadge.svg';
import googlePlayImg from '../../images/googlePlayBadge.png';

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
const ImgContainer = styled.div`
  flex-basis: 100%;
  margin: 10px 0;
`;
const WalletRow = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  &:hover {
    background: #FFFFFF;
  }
`;
const WalletRowNonLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  flex-wrap: wrap;
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
`;
const AppStoreIcons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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
  const { showQRCodeModal, QRCode, QRCodeUrl, isMobile, customDesktopWallet } = state;
  const options = ['qr', isMobile ? 'mobile' : 'desktop'];
  const [view, setView] = useState('qr');
  const [provExtId, setProvExtId] = useState(PLUGIN_PROVENANCE_WALLET);
  const [showProvExtId, setShowProvExtId] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState<number>(-1);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [appUrlProd, setAppUrlProd] = useState('');
  const encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
  const customProvExtId = provExtId !== PLUGIN_PROVENANCE_WALLET;

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(() => () => { if (timeoutInstance) clearTimeout(timeoutInstance); }, [timeoutInstance]);

  // Attempt to grab the mobile app url from firebase if we're on a mobile device
  useEffect(() => {
    const urlExists = appUrlProd;
    if (
      !urlExists
      && !urlsLoading
      && isMobile
      && QRCodeUrl
    ) {
      const fetchFirebase = () => {
        // Set is loading
        setUrlsLoading(true);
        const url = FIREBASE_FETCH_WALLET_URL;
        const linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
        const linkProd = `${DYNAMIC_LINK_INFO_PROD.link}?data=${linkData}`;
        // First fetch prod, then dev
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({ dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_PROD, link: linkProd } })
        })
        .then((response) => response.json())
        .then(({ shortLink }) => { setAppUrlProd(shortLink) })
        .catch(() => {
          // Remove env from loading list
          setUrlsLoading(false);
        })
      };
      // Fetch both dev and prod firebase dynamic url data
      fetchFirebase();
    }
  }, [isMobile, QRCodeUrl, appUrlProd, urlsLoading]);

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

  const renderQRView = () => (
    <>
      <Text>{title}</Text>
      <ImgContainer>
        <img src={QRCode} alt="WalletConnect QR Code" />
      </ImgContainer>
      { copied ? <Text>Copied to clipboard!</Text> : <Text link onClick={copyToClipboard}>Copy to clipboard</Text> }
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

  const handleExtensionAppOpen = (event:React.MouseEvent) => {
    const shiftKeyPressed = event.shiftKey;
    if (shiftKeyPressed) {
      if (showProvExtId) { setProvExtId(PLUGIN_PROVENANCE_WALLET) } // reset value when closing
      setShowProvExtId(!showProvExtId);
    } else if (provExtId) {
      // Set the extension id into the walletconnect-js state
      wcs.setState({ extensionId: provExtId });
      const data = { uri: encodedQRCodeUrl, event: 'walletconnect_init' };
      window?.chrome.runtime.sendMessage(provExtId, data);
    }
  };

  const renderDesktopView = () => (
    <>
      <Text>Select wallet</Text>
      <WalletRowNonLink onClick={handleExtensionAppOpen}>
        <WalletTitle custom={customProvExtId}>
          Provenance {customProvExtId && "(Custom ID)"}
        </WalletTitle>
        <WalletIcon src={provenanceSvg} />
        {showProvExtId && (
          <input
            value={provExtId}
            placeholder="Extension ID"
            onChange={({ target }) => {
              setProvExtId(target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </WalletRowNonLink>
      {customDesktopWallet && (
        // Pass back encodedQRCodeUrl
        <WalletRowNonLink onClick={e => customDesktopWallet.onClick(e, encodedQRCodeUrl)}>
          <WalletTitle>
            {customDesktopWallet.walletTitle}
          </WalletTitle>
          { customDesktopWallet.children }
        </WalletRowNonLink>
      )}
    </>
  );
  const renderMobileView = () => (
    <>
      <Text>Select wallet</Text>
      {appUrlProd && (
        <WalletRow href={appUrlProd} rel="noopener noreferrer" target="_blank">
          <WalletTitle>Provenance Mobile Wallet</WalletTitle>
          <WalletIcon src={provenanceSvg} />
        </WalletRow>
      )}
    </>
  );

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
        { view === 'qr' && renderQRView() }
        { view === 'desktop' && renderDesktopView() }
        { view === 'mobile' && renderMobileView() }
      </QRModalContent>
    </QRCodeModalContainer>
  ) : null;
};
