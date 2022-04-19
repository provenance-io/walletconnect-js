import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { WalletConnectService } from 'services';
import {
  PLUGIN_FIGURE_WALLET,
  PLUGIN_PROVENANCE_WALLET,
  UNICORN_SPARKLE_WALLET_URL,
  FIREBASE_FETCH_WALLET_URL,
  DYNAMIC_LINK_INFO_PROD,
  DYNAMIC_LINK_INFO_DEV,
} from '../../consts';
import provenanceSvg from '../../images/provenance.svg';
import figureSvg from '../../images/figure.svg';
import unicornPng from '../../images/unicorn.png';

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
const WalletTitle = styled.div`
  font-weight: 900;
  font-size: 2rem;
`;
const WalletIcon = styled.img`
  background: #FFFFFF;
  border-radius: 4px;
  height: 30px;
  width: 30px;
`;
const InProgress = styled.div`
  position: absolute;
  top: 0;
  right: 40px;
  font-size: 11px;
  text-align: center;
  font-weight: bold;
  color: white;
`;
const FlagIcon = styled.div`
  width: 110px;
  height: 86px;
  padding-top: 20px;
  position: relative;
  background: #4A76D4;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 13px solid #EEEEEE;
    border-left: 55px solid transparent;
    border-right: 55px solid transparent;
  }
`;

interface Props {
  className: string,
  walletConnectService: WalletConnectService,
  title: string
}

const QRCodeModal:React.FC<Props> = ({
  className,
  walletConnectService: wcs,
  title = 'Scan the QRCode with your Mobile Provenance wallet.',
}) => {
  const { state } = wcs;
  const { showQRCodeModal, QRCode, QRCodeUrl, isMobile } = state;
  const options = ['qr', isMobile ? 'mobile' : 'desktop'];
  const [view, setView] = useState('qr');
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState<number>(-1);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [appUrlProd, setAppUrlProd] = useState('');
  const [appUrlDev, setAppUrlDev] = useState('');
  
  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(() => () => { if (timeoutInstance) clearTimeout(timeoutInstance); }, [timeoutInstance]);

  // Attempt to grab the mobile app url from firebase if we're on a mobile device
  useEffect(() => {
    const urlExists = appUrlProd || appUrlDev;
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
        const linkDev = `${DYNAMIC_LINK_INFO_DEV.link}?data=${linkData}`;
        // First fetch prod, then dev
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({ dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_PROD, link: linkProd } })
        })
        .then((response) => response.json())
        .then(({ shortLink }) => { setAppUrlProd(shortLink) })
        .then(() => {
          // Fetch dev
          fetch(url, {
            method: 'POST',
            body: JSON.stringify({ dynamicLinkInfo: { ...DYNAMIC_LINK_INFO_DEV, link: linkDev } })
          })
          .then((response) => response.json())
          .then(({ shortLink }) => { setAppUrlDev(shortLink) })
        })
        .catch(() => {
          // Remove env from loading list
          setUrlsLoading(false);
        })
      };
      // Fetch both dev and prod firebase dynamic url data
      fetchFirebase();
    }
  }, [isMobile, QRCodeUrl, appUrlDev, appUrlProd, urlsLoading]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(QRCodeUrl).then(() => {
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
    </>
  );
  const renderDesktopView = () => (
    <>
      <Text>Select wallet</Text>
      <WalletRow href={`${PLUGIN_FIGURE_WALLET}${QRCodeUrl}`} rel="noopener noreferrer" target="_blank">
        <WalletTitle>Figure</WalletTitle>
        <WalletIcon src={figureSvg} />
      </WalletRow>
      <WalletRow href={`${PLUGIN_PROVENANCE_WALLET}${QRCodeUrl}`} rel="noopener noreferrer" target="_blank">
        <WalletTitle>Provenance</WalletTitle>
        <WalletIcon src={provenanceSvg} />
      </WalletRow>
    </>
  );
  const renderMobileView = () => (
    <>
      <Text>Select wallet</Text>
      <WalletRow href={`${UNICORN_SPARKLE_WALLET_URL}${QRCodeUrl}`} rel="noopener noreferrer" target="_blank">
        <WalletTitle>Unicorn Sparkle Wallet</WalletTitle>
        <WalletIcon src={unicornPng} />
      </WalletRow>
      {appUrlDev && (
        <WalletRow href={appUrlDev} rel="noopener noreferrer" target="_blank">
          <WalletTitle>Provenance Mobile Wallet (Dev)</WalletTitle>
          <WalletIcon src={provenanceSvg} />
        </WalletRow>
      )}
      {appUrlProd && (
        <WalletRow href={appUrlProd} rel="noopener noreferrer" target="_blank">
          <WalletTitle>Provenance Mobile Wallet (Prod)</WalletTitle>
          <WalletIcon src={provenanceSvg} />
        </WalletRow>
      )}
    </>
  );

  return showQRCodeModal ? (
    <QRCodeModalContainer className={className} onClick={() => wcs.showQRCode(false)}>
      <QRModalContent onClick={(e) => e.stopPropagation()}>
        <InProgress><FlagIcon>Wallet Coming Soon!</FlagIcon></InProgress>
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

export default QRCodeModal;
