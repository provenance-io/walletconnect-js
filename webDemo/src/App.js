import { useState } from 'react';
import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import {
  Action,
  Connect,
  Disconnect,
  Popup,
  Button,
} from 'Components';
import { ALL_ACTIONS } from 'consts';
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
  color: ${({ color }) => color };
`;
const Text = styled.p`
  font-size: 1.6rem;
  line-height: 3rem;
  width: 600px;
  margin: 0 0 20px 0;
  &:last-of-type {
    margin-bottom: 20px;
  }
`;
const ConnectedContent = styled.div`
  width: 600px;
`;
const ActionButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;
  margin-bottom: 40px;
  button {
    min-width: 165px;
    margin-bottom: 10px;
  }
`;

export const App = () => {
  const [popupContent, setPopupContent] = useState('');
  const [popupStatus, setPopupStatus] = useState('success');
  const [popupDuration, setPopupDuration] = useState(2500);
  const [activeMethod, setActiveMethod] = useState('');
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const {
    address,
    connected,
    peer,
  } = walletConnectState;

  const setPopup = (message, status, duration) => {
    setPopupContent(message);
    if (status) { setPopupStatus(status); }
    if (duration) { setPopupDuration(duration); }
  }

  const renderActionButtons = () => ALL_ACTIONS.map(({ method }) => (
    <Button color="#333333" key={method} onClick={() => setActiveMethod(method)}>{method}</Button>
  ));

  const renderActions = () => ALL_ACTIONS.map(({ method, fields, buttonTxt }) => activeMethod === method ? (
    <Action
      key={method}
      method={method}
      setPopup={setPopup}
      fields={fields}
      buttonTxt={buttonTxt}
    />
  ) : null);

  return (
    <HomeContainer>
        {popupContent && <Popup delay={popupDuration} onClose={() => setPopupContent('')} status={popupStatus}>{popupContent}</Popup>}
        <Header color={`#${Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, '0')}`}>Provenance.io | WalletConnect-JS | WebDemo</Header>
        {connected ? (
          <>
            {peer?.name && <Text>Wallet: {peer.url ? <a href={peer.url} target="_blank" rel="noreferrer">{peer.name}</a> : peer.name}</Text>}
            <Text>Address: <a href={`https://explorer.provenance.io/accounts/${address}`} target="_blank" rel="noreferrer">{address}</a></Text>
            <Text>Select an action</Text>
          </>
        ) : (
          <Text>Use your phone to connect a Provenance.io wallet</Text>
        )}
        {connected ? (
          <ConnectedContent>
            <ActionButtonsContainer>{renderActionButtons()}</ActionButtonsContainer>
            {renderActions()}
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
