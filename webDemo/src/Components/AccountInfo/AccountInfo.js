import styled from 'styled-components';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { CopyValue, Button } from 'Components';
import USER_ICON from 'img/userIcon.svg';

const AccountInfoContainer = styled.div`
  display: flex;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ minWidth }) => minWidth && `min-width: ${minWidth}`};
  &:first-of-type {
    margin-right: 30px;
  }
`;
const AccountRow = styled.div`
  display: flex;
  align-content: center;
  line-height: 14px;
  ${({ end }) => end && 'justify-content: flex-end;' }
`;
const Title = styled.div`
  font-weight: bold;
  margin: 0 6px;
  min-width: 75px;
`;
const Value = styled.div`
  margin-right: 4px;
`;

export const AccountInfo = ({ bridgeUrl }) => { // eslint-disable-line react/prop-types
  const { walletConnectService, walletConnectState } = useWalletConnect();
  const { address, publicKey, peer = {}, connected } = walletConnectState;

  const handleDisconnect = () => {
    walletConnectService.disconnect();
  };

  return (
    <AccountInfoContainer> 
      <Column minWidth="300px">
        <AccountRow>
          <img src={USER_ICON} alt="wallet name" />
          <Title>Wallet Name:</Title>
          <Value title={peer?.description || 'N/A'}>{peer?.name || 'N/A'}</Value>
          {peer?.name && <CopyValue value={peer?.name}/>}
        </AccountRow>
        <AccountRow>
          <img src={USER_ICON} alt="address" />
          <Title>Address:</Title>
          <Value>{address || 'N/A'}</Value>
          {address && <CopyValue value={address}/>}
        </AccountRow>
      </Column>
      <Column minWidth="425px">
        <AccountRow>
          <img src={USER_ICON} alt="public key" />
          <Title>Public Key:</Title>
          <Value>{publicKey || 'N/A'}</Value>
          {publicKey && <CopyValue value={publicKey}/>}
        </AccountRow>
        <AccountRow>
          <img src={USER_ICON} alt="bridge url" />
          <Title>Bridge Url:</Title>
          <Value>{bridgeUrl || 'N/A'}</Value>
          {bridgeUrl && <CopyValue value={bridgeUrl}/>}
        </AccountRow>
      </Column>
      {connected && (
        <Column>
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </Column>
      )}
    </AccountInfoContainer>
  );
};
