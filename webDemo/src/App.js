import { useState } from 'react';
import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import {
  AddMarker,
  Connect,
  DelegateHash,
  Disconnect,
  Popup,
  SendHash,
  SignJWT,
  SignMessage,
} from 'Components';
import { REACT_APP_WCJS_VERSION } from './version'; // eslint-disable-line

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

export const App = () => {
  const [popupContent, setPopupContent] = useState('');
  const [popupStatus, setPopupStatus] = useState('success');
  const [popupDuration, setPopupDuration] = useState(2500);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const {
    address,
    addMarkerLoading,
    connected,
    delegateHashLoading,
    peer,
    sendHashLoading,
    signJWTLoading,
    signMessageLoading,
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
            <AddMarker walletConnectService={wcs} loading={addMarkerLoading} setPopup={setPopup} />
            <SignJWT walletConnectService={wcs} loading={signJWTLoading} setPopup={setPopup} />
            <Disconnect walletConnectService={wcs} setPopup={setPopup} />
          </ConnectedContent>
        ): ( 
          <Connect walletConnectService={wcs} setPopup={setPopup} />
        )}
        <QRCodeModal
          walletConnectService={wcs}
          walletConnectState={walletConnectState}
          title="Scan to initiate walletConnect-js session"
        />
        <div>WalletConnect-JS Version: {REACT_APP_WCJS_VERSION || '??.??.??'}</div>
    </HomeContainer>
  );
}
