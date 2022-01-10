import { useState, useEffect } from 'react';
import { useWalletConnect, QRCodeModal } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import {
  Action,
  Connect,
  Disconnect,
  Dropdown,
  Popup,
} from 'Components';
import { ALL_ACTIONS } from 'consts';
import { REACT_APP_WCJS_VERSION } from './version'; // eslint-disable-line

const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  position: relative;
`;
const Header = styled.h1`
  font-size: 3rem;
  line-height: 3rem;
  font-weight: bold;
  letter-spacing: 0.25rem;
  margin-bottom: 40px;
  color: ${({ color }) => color };
  transition: 6s all;
`;
const Text = styled.p`
  font-size: 1.6rem;
  line-height: 3rem;
  margin: 0;
`;
const Content = styled.div`
  width: 600px;
  padding: 30px 50px;
  border-radius: 4px;
  background: #ffffff;
  margin-bottom: 40px;
`;

export const App = () => {
  const [popupContent, setPopupContent] = useState('');
  const [popupStatus, setPopupStatus] = useState('success');
  const [popupDuration, setPopupDuration] = useState(2500);
  const [activeMethod, setActiveMethod] = useState('');
  const [randomColor, setRandomColor] = useState(`#${Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, '0')}`);
  const [colorInterval, setColorInterval] = useState(null);

  useEffect(() => {
    if (!colorInterval) {
      const newInterval = setInterval(() => {
        setRandomColor(`#${Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, '0')}`);   
      }, 6000);
      setColorInterval(newInterval);
    }
  }, [colorInterval])

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

  const dropdownOptions = ALL_ACTIONS.map(({ method }) => method);
  dropdownOptions.sort();
  dropdownOptions.unshift('Select Method/Action...');

  const renderActions = () => ALL_ACTIONS.map(({ method, fields, buttonTxt, windowMessage }) => activeMethod === method ? (
    <Action
      key={method}
      method={method}
      setPopup={setPopup}
      fields={fields}
      buttonTxt={buttonTxt}
      windowMessage={windowMessage}
    />
  ) : null);

;

  return (
    <HomeContainer>
        {popupContent && <Popup delay={popupDuration} onClose={() => setPopupContent('')} status={popupStatus}>{popupContent}</Popup>}
        <Header color={randomColor}>WalletConnect-JS | WebDemo</Header>
        <Content>
          {connected ? (
            <>
              {peer?.name && <Text>Wallet: {peer.url ? <a href={peer.url} target="_blank" rel="noreferrer">{peer.name}</a> : peer.name}</Text>}
              <Text>Address: <a href={`https://explorer.provenance.io/accounts/${address}`} target="_blank" rel="noreferrer">{address}</a></Text>
              <Text>Select an action:</Text>
              <Dropdown name="actions" options={dropdownOptions} onChange={setActiveMethod} value={activeMethod} />
              {renderActions()}
              <Disconnect walletConnectService={wcs} setPopup={setPopup} />
            </>
          ): (
            <Connect walletConnectService={wcs} setPopup={setPopup} />
          )}
        </Content>
        <QRCodeModal
          walletConnectService={wcs}
          walletConnectState={walletConnectState}
          title="Scan to initiate walletConnect-js session"
        />
        <div>WalletConnect-JS Version: {REACT_APP_WCJS_VERSION || '??.??.??'}</div>
    </HomeContainer>
  );
}
