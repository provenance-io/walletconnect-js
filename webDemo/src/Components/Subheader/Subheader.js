import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { decodeJWT } from 'utils';
import { CountdownTimer } from '../CountdownTimer';
import { Modal } from '../Modal';

const Wrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  background: #2d2461;
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
`;
const ModalContent = styled.div`
  background: #FFFFFF;
  border: 1px solid #dddddd;
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 50px 30px;
  border-radius: 10px;
  min-height: 300px;
  max-width: 500px;
  position: relative;
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
const ModalText = styled.div`
  font-size: 1.6rem;
  text-align: center;
`;


export const Subheader = ({ signedJWT, address, getSignedJWT }) => {
  const [showModal, setShowModal] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('');
  // Need to decode signedJWT and note the expiration time
  const { payload: signedJWTPayload, valid: signedJWTValid } = decodeJWT(signedJWT, { addr: address });
  // Pull out expiration date for jwt (in seconds)
  const { exp: signedJWTExpiration } = signedJWTPayload;
  // Get current time in seconds and compare it to expiration
  const timeNow = Math.ceil(new Date().getTime() / 1000);
  const expiresIn = signedJWTExpiration - timeNow;
  // const expiresIn = 305; // Temp testing, just set to 5min10sec ***REMOVE ME***
  
  const closeModal = () => {
    setShowModal(false);
  };

  const sessionWarning = () => {
    setSessionStatus('warning');
    setShowModal(true);
  };
  const sessionExpired = () => {
    setSessionStatus('expired');
    setShowModal(true);
  }

  return (
    signedJWTValid ? (
      <Wrapper>
        <Title>Signed JWT Expires In:</Title>
        <CountdownTimer
          start={expiresIn}
          onEnd={sessionExpired}
          timeEvents={{
            300: sessionWarning,
          }}
        />
        <Modal isOpen={showModal} close={closeModal}>
          <ModalContent>
            <ModalClose onClick={closeModal}>+</ModalClose>
            {sessionStatus === 'warning' ? (
              <ModalText>
                Your Signed JWT will expire soon, click the button below to re-sign.
                <button type="button" onClick={getSignedJWT}>Get SignedJWT</button>
              </ModalText>
            ) : null}
            {sessionStatus === 'error' ? (
              <ModalText>
                Your Signed JWT has expired, click the button below to re-sign.
                <button type="button" onClick={getSignedJWT}>Get SignedJWT</button>
              </ModalText>
            ) : null}
          </ModalContent>
        </Modal>
      </Wrapper>
    ) : null
  );
};

Subheader.propTypes = {
  signedJWT: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  getSignedJWT: PropTypes.func.isRequired,
}