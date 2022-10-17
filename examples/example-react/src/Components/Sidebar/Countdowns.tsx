import { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { decodeJWT } from 'utils';
import { CountdownTimer, Modal, Button } from 'Components';

const RowInfo = styled.div`
  padding: 0 20px 0 40px;
  font-size: 0.95rem;
  color: ${COLORS.NEUTRAL_600};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;
const RowInfoTitle = styled.p`
  font-weight: 700;
  user-select: none;
  flex-basis: 100%;
  margin-bottom: 4px;
  font-size: 1.2rem;
`;
const RowInfoValue = styled.div`
  display: flex;
  align-items: flex-start;
  flex-basis: 100%;
  word-break: break-all;
`;
const ModalContent = styled.div`
  background: ${COLORS.WHITE};
  border: 1px solid ${COLORS.NEUTRAL_200};
  box-shadow: 1px 1px 4px 0px ${COLORS.BLACK_20};
  padding: 50px 30px;
  border-radius: 4px;
  min-height: 300px;
  max-width: 500px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;
const ModalClose = styled.div`
  color: ${COLORS.NEUTRAL_600};
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  font-size: 2.8rem;
  font-weight: bold;
  right: 16px;
  cursor: pointer;
`;
const ModalText = styled.div`
  font-size: 1.6rem;
  text-align: center;
  width: 100%;
  &:first-letter {
    text-transform: capitalize;
  }
`;

export const Countdowns: React.FC = () => {
  const [showPopupModal, setShowPopupModal] = useState(false); // Popup modal will warn the user befor the JWT or Connection expire
  const [popupModalMsg, setPopupModalMsg] = useState(''); // What message should the popup modal display?
  const { walletConnectState } = useWalletConnect();
  const { address, connected, connectionEat, signedJWT } = walletConnectState;
  // Need to decode signedJWT and note the expiration time
  const { payload: JWTPayload, valid: JWTValid } = decodeJWT(signedJWT, {
    addr: address,
  });
  // Pull out expiration date for jwt (in seconds)
  const { exp: JWTExp } = JWTPayload;

  const handleCountdownExpires = (type: 'jwt' | 'connection') => {
    setPopupModalMsg(`${type} Expired`);
    setShowPopupModal(true);
  };
  const handleCountdownWarning = (type: 'jwt' | 'connection') => {
    setPopupModalMsg(`${type} Expires Soon`);
    setShowPopupModal(true);
  };
  const closePopupModal = () => {
    setShowPopupModal(false);
  };

  const showCountdowns = (connected && connectionEat) || JWTValid;
  return showCountdowns ? (
    <>
      {connected && connectionEat && (
        <RowInfo title="WalletConnect-JS connection expiration countdown">
          <RowInfoTitle>Connection Expires</RowInfoTitle>
          <RowInfoValue>
            <CountdownTimer
              expires={connectionEat}
              onEnd={() => handleCountdownExpires('connection')}
              timeEvents={{
                300: () => handleCountdownWarning('connection'),
                60: () => handleCountdownWarning('connection'),
              }}
            />
          </RowInfoValue>
        </RowInfo>
      )}
      {JWTValid && (
        <RowInfo title="Signed JWT expiration countdown">
          <RowInfoTitle>JWT Expires</RowInfoTitle>
          <RowInfoValue>
            <CountdownTimer
              expires={JWTExp}
              onEnd={() => handleCountdownExpires('jwt')}
              timeEvents={{
                300: () => handleCountdownWarning('jwt'),
                60: () => handleCountdownWarning('jwt'),
              }}
            />
          </RowInfoValue>
        </RowInfo>
      )}
      <Modal isOpen={showPopupModal} close={closePopupModal}>
        <ModalContent>
          <ModalClose onClick={closePopupModal}>+</ModalClose>
          <ModalText>{popupModalMsg}</ModalText>
          <Button onClick={closePopupModal}>Ok</Button>
        </ModalContent>
      </Modal>
    </>
  ) : null;
};
