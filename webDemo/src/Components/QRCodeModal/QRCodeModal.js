import { useWalletConnect } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
const Text = styled.p`
  font-size: 1.6rem;
  line-height: 3rem;
  width: 600px;
  margin: 0;
`;
const ImgContainer = styled.div`
  flex-basis: 100%;
`;

const QRCodeModal = ({ className, children, title }) => {
  const { walletConnectService: wcs, walletConnectState: state } = useWalletConnect();
  const { showQRCodeModal, QRCode } = state;

  return showQRCodeModal ? (
    <QRCodeModalContainer className={className}>
      <QRModalContent>
        <CloseQRModal onClick={() => wcs.showQRCode(false)}>+</CloseQRModal>
        <Text>{title}</Text>
        <ImgContainer>
          <img src={QRCode} alt="QR Code" />
        </ImgContainer>
        {children}
      </QRModalContent>
    </QRCodeModalContainer>
  ) : null;
};

QRCodeModal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
};

QRCodeModal.defaultProps = {
  className: '',
  children: null,
  title: 'Scan the QRCode with your Figure or Provenance wallet to get started.',
};

export default QRCodeModal;
