import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { PLUGIN_FIGURE_WALLET, PLUGIN_PROVENANCE_WALLET } from '../../consts';
import provenanceSvg from '../../images/provenance.svg';
import figureSvg from '../../images/figure.svg';

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
const ToggleNotch = styled.div`
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
const Text = styled.p`
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
  padding: 10px;
  height: 30px;
  width: 30px;
`;

const QRCodeModal = ({
  className,
  walletConnectService: wcs,
  walletConnectState: state,
  title,
  options,
}) => {
  const [view, setView] = useState(options.includes('qr') ? 'qr' : 'desktop');
  const [copied, setCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(null);

  const { showQRCodeModal, QRCode, QRCodeUrl } = state;
  
  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(() => () => { if (timeoutInstance) clearTimeout(timeoutInstance); }, [timeoutInstance]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(QRCodeUrl).then(() => {
      clearTimeout(timeoutInstance);
      setCopied(true);
      const newTimeoutInstance = setTimeout(() => {
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
      <Text>Select a wallet to use</Text>
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
        </Toggle>
        { view === 'qr' ? renderQRView() : renderDesktopView() }
      </QRModalContent>
    </QRCodeModalContainer>
  ) : null;
};

QRCodeModal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOf(['qr', 'desktop']),
  ),
  walletConnectService: PropTypes.shape({ showQRCode: PropTypes.func }).isRequired,
  walletConnectState: PropTypes.shape({
    showQRCodeModal: PropTypes.bool,
    QRCode: PropTypes.string,
    QRCodeUrl: PropTypes.string,
  }).isRequired,
};

QRCodeModal.defaultProps = {
  className: '',
  title: 'Scan the QRCode with your Mobile Provenance wallet.',
  options: ['qr', 'desktop'],
};

export default QRCodeModal;
