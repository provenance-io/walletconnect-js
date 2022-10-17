import styled from 'styled-components';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { useEffect, useState } from 'react';
import { decodeJWT } from 'utils';
import { CountdownTimer } from '../CountdownTimer';
import { Modal } from '../Modal';
import { Button } from '../Button';

const Wrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  background: #0e0f28;
  padding: 4px 40px;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  color: white;
  z-index: 90;
  @media (max-width: 1280px) {
    padding: 14px 20px;
  }
  @media (max-width: 1150px) {
    justify-content: center;
  }
  @media (max-width: 780px) {
    padding: 6px;
  }
`;
const Title = styled.div`
  margin-right: 10px;
  color: #aaaaaa;
`;
const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #dddddd;
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 50px 30px;
  border-radius: 10px;
  min-height: 300px;
  max-width: 500px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;
const ModalClose = styled.div`
  color: #333333;
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  font-size: 2.8rem;
  font-weight: bold;
  right: 10px;
  cursor: pointer;
`;
const Item = styled.div`
  margin: 0 10px;
  display: flex;
  align-items: center;
`;
const ModalText = styled.div`
  font-size: 1.6rem;
  text-align: center;
  width: 100%;
`;

export const Subheader = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [expires, setExpires] = useState(0);
  const [JWTValid, setJWTValid] = useState(false);
  const [error, setError] = useState('');
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { signedJWT, address, loading, connectionEat, connected } =
    walletConnectState;
  // Listen for window events for signing JWT
  useEffect(() => {
    // Sign JWT Success
    const successEvent = () => {
      setShowModal(false);
      setModalMessage('');
      setError('');
    };
    const failEvent = (result?: { [key: string]: any }) => {
      setError(result?.error?.message || 'Failed to sign JWT, try again later.');
    };
    wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, successEvent);
    wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, failEvent);

    return () => {
      wcs.removeListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, successEvent);
      wcs.removeListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, failEvent);
    };
  }, [wcs]);

  // Every time the Signed JWT changes, reset/restart the timer
  useEffect(() => {
    if (signedJWT) {
      // Need to decode signedJWT and note the expiration time
      const { payload: signedJWTPayload, valid: signedJWTValid } = decodeJWT(
        signedJWT,
        { addr: address }
      );
      // Pull out expiration date for jwt (in seconds)
      const { exp: signedJWTExpiration } = signedJWTPayload;
      setExpires(signedJWTExpiration);
      setJWTValid(signedJWTValid);
    }
  }, [signedJWT, address]);

  // This component requires a signedJWT, if it doesn't exist we need to nope-out and return null
  if (!signedJWT) return null;

  const closeModal = () => {
    setShowModal(false);
  };

  const sessionWarning = () => {
    setModalMessage(
      'Your Signed JWT will expire soon, click the button below to re-sign.'
    );
    setShowModal(true);
  };
  const sessionExpired = () => {
    setModalMessage(
      'Your Signed JWT has expired, click the button below to re-sign.'
    );
    setShowModal(true);
  };
  const handleButtonClick = () => {
    const now = new Date();
    const expires = now.setHours(24 + now.getHours());
    wcs.signJWT(new Date(expires).getTime());
  };
  return connected ? (
    <Wrapper>
      {JWTValid && (
        <Item>
          <Title>Signed JWT Expires In:</Title>
          <CountdownTimer
            expires={expires}
            onEnd={sessionExpired}
            timeEvents={{
              300: sessionWarning,
              310: sessionWarning,
            }}
          />
        </Item>
      )}
      {connected && connectionEat && (
        <Item>
          <Title>WalletConnect Session Expires In:</Title>
          <CountdownTimer expires={connectionEat} />
        </Item>
      )}
      <Modal isOpen={showModal} close={closeModal}>
        <ModalContent>
          <ModalClose onClick={closeModal}>+</ModalClose>
          <ModalText>
            {loading === 'signJWT'
              ? 'Waiting on approval in wallet device...'
              : null}
            {error}
            {!loading && !error ? modalMessage : null}
          </ModalText>
          <Button onClick={handleButtonClick} loading={loading === 'signJWT'}>
            {loading === 'signJWT' ? 'Waiting...' : 'Sign New JWT (24 Hours)'}
          </Button>
        </ModalContent>
      </Modal>
    </Wrapper>
  ) : null;
};
