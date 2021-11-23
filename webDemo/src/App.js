import { useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import {
  Popup,
  Disconnect,
  Connect,
  SignMessage,
  SendHash,
  DelegateHash,
  SignJWT,
} from 'Components';

const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  background: #ffffff;
  border-radius: 4px;
  padding: 60px 30px;
  position: relative;
`;
const Header = styled.h1`
  font-size: 3rem;
  line-height: 3rem;
  font-weight: 500;
  margin-bottom: 40px;
`;
const Text = styled.p`
  font-size: 1.6rem;
  line-height: 3rem;
  width: 600px;
  margin: 0;
  &:last-of-type {
    margin-bottom: 20px;
  }
`;
const ConnectedContent = styled.div`
  width: 500px;
`;
const QRCodeModal = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.50);
`;
const CloseQRModal = styled.div`
  transform: rotate(45deg);
  font-size: 3rem;
  color: #333333;
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
const QRModalContent = styled.div`
  height: 400px;
  width: 400px;
  position: relative;
  border-radius: 10px;
  background: #eeeeee;
  max-width: 100%;
  padding: 40px;
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.25);
`;

export const App = () => {
  const [showQR, setShowQR] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupStatus, setPopupStatus] = useState('success');
  const [popupDuration, setPopupDuration] = useState(2500);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const {
    QRCode,
    connected,
    address,
    peer,
    sendHashLoading,
    signMessageLoading,
    signJWTLoading,
    delegateHashLoading,
  } = walletConnectState;

  const setPopup = (message, status, duration) => {
    setPopupContent(message);
    if (status) { setPopupStatus(status); }
    if (duration) { setPopupDuration(duration); }
  }

  return (
    <HomeContainer>
        {popupContent && <Popup delay={popupDuration} onClose={() => setPopupContent('')} status={popupStatus}>{popupContent}</Popup>}
        <Header>Provenance.io | WalletConnect-JS | WebDemo</Header>
        {connected ? (
          <>
            <Text>Connected!</Text>
            {peer?.name && <Text>- Wallet: {peer.url ? <a href={peer.url} target="_blank" rel="noreferrer">{peer.name}</a> : peer.name}</Text>}
            <Text>- Address: <a href={`https://explorer.provenance.io/accounts/${address}`} target="_blank" rel="noreferrer">{address}</a></Text>
            <Text>Actions:</Text>
          </>
        ) : (
          <Text>Use your phone to connect a Provenance.io wallet</Text>
        )}
        {connected ? (
          <ConnectedContent>
            <SignMessage walletConnectService={wcs} loading={signMessageLoading} setPopup={setPopup} />
            <SendHash walletConnectService={wcs} loading={sendHashLoading} setPopup={setPopup} />
            <DelegateHash walletConnectService={wcs} loading={delegateHashLoading} setPopup={setPopup} />
            <SignJWT walletConnectService={wcs} loading={signJWTLoading} setPopup={setPopup} />
            <Disconnect walletConnectService={wcs} setPopup={setPopup} />
          </ConnectedContent>
        ): ( 
          <Connect walletConnectService={wcs} setPopup={setPopup} setShowQR={setShowQR} />
        )}
        {!connected && QRCode && showQR && (
          <QRCodeModal>
            <QRModalContent>
              <CloseQRModal onClick={() => setShowQR(false)}>+</CloseQRModal>
              <Text>Scan the QRCode with your Figure or Provenance wallet to get started.</Text>
              <img src={QRCode} alt="QR Code" />
            </QRModalContent>
          </QRCodeModal>
        )}
    </HomeContainer>
  );
}
