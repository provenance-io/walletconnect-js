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
const RowInfoTitle = styled.div`
  font-weight: 700;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-basis: 100%;
  margin-bottom: 4px;
  font-size: 1.2rem;
  cursor: pointer;
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
  const { address, connected, connectionEXP, signedJWT } = walletConnectState;
  // Need to decode signedJWT and note the expiration time
  const { payload: JWTPayload, valid: JWTValid } = decodeJWT(signedJWT, {
    addr: address,
  });
  // Pull out expiration date for jwt (in seconds)
  const { exp: JWTExpSec } = JWTPayload;
  // Convert JWT Expiration to ms for countdown
  const JWTExpMs = JWTExpSec * 1000;

  const handleCountdownExpires = (type: 'jwt' | 'connection') => {
    setPopupModalMsg(`${type} Expired`);
    setShowPopupModal(true);
  };
  const closePopupModal = () => {
    setShowPopupModal(false);
  };

  const showCountdowns = (connected && connectionEXP) || JWTValid;
  return showCountdowns ? (
    <>
      {connected && connectionEXP && (
        <RowInfo title="Click to reset connection timeout">
          <RowInfoTitle
            title={`Connection Expires: ${new Date(connectionEXP).toLocaleDateString(
              'en-US',
              {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }
            )}`}
          >
            Connection Expires
          </RowInfoTitle>
          <RowInfoValue>
            <CountdownTimer
              expires={connectionEXP}
              onEnd={() => handleCountdownExpires('connection')}
            />
          </RowInfoValue>
        </RowInfo>
      )}
      {JWTValid && (
        <RowInfo
          title={`JWT Expires: ${new Date(JWTExpMs).toLocaleDateString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}`}
        >
          <RowInfoTitle>JWT Expires</RowInfoTitle>
          <RowInfoValue>
            <CountdownTimer
              expires={JWTExpMs}
              onEnd={() => handleCountdownExpires('jwt')}
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
