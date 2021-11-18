import { useState, useEffect } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import { RocketLogo, Button as BaseButton, Popup } from 'Components';
import { useApp } from 'redux/hooks';

const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.WHITE };
  border-radius: 4px;
  padding: 60px 30px;
`;
const Header = styled.h1`
  font-size: 5rem;
  line-height: 5rem;
  font-family: ${({ theme }) => theme.FONT_FAMILY_PRIMARY };
  font-weight: ${({ theme }) => theme.FONT_WEIGHT_NORMAL };
  margin-bottom: 40px;
`;
const Title = styled.h2`
  font-size: 2rem;
`;
const Subtitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 40px;
`;
const Text = styled.p`
  font-size: 1.6rem;
  line-height: 3rem;
  margin-bottom: 30px;
`;
const ConnectedContent = styled.div`
  width: 500px;
`;
const ActionSection = styled.div`
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.PURPLE_PRIMARY };
  border-radius: 5px;
  display: flex;
  width: 100%;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 1px 1px 3px 1px ${({ theme }) => theme.BLACK10 };
  position: relative;
  &:nth-of-type(2) {
    border-color: ${({ theme }) => theme.GREEN_DARK };
  }
  &:nth-of-type(3) {
    border-color: ${({ theme }) => theme.BLUE_PRIMARY };
  }
  &:nth-of-type(4) {
    border-color: ${({ theme }) => theme.ORANGE_PRIMARY };
  }
  &:last-of-type {
    border-color: ${({ theme }) => theme.RED_PRIMARY };
  }
`;
const SmallButton = styled(BaseButton)`
  font-size: 1.0rem;
  padding: 6px 10px;
  flex-basis: 20%;
  height: 44px;
  border-radius: 5px;
`;
const InputContainer = styled.div`
  position: relative;
  flex-basis: ${({ width }) => width || '10%' };
  display: flex;
`;
const Input = styled.input`
  padding: 6px 10px;
  height: 30px;
  width: 100%;
  box-sizing: content-box;
  border-radius: 0;
  margin-right: 4px;
  border: 1px solid ${({ theme }) => theme.GREY_PRIMARY };
`;
const InputLabel = styled.label`
  font-size: 1.0rem;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT_BOLD };
  position: absolute;
  top: -16px;
  left: 0;
`;
const Info = styled.div`
  font-size: 1.4rem;
  margin-right: 40px;
`;

export const Home = () => {
  const [popupContent, setPopupContent] = useState('');
  const [popupStatus, setPopupStatus] = useState('success');
  const [popupDuration, setPopupDuration] = useState(2500);
  const [signMessageText, setSignMessageText] = useState('WalletConnect-JS | WebDemo | Sign Message');
  const [sendHashData, setSendHashData] = useState({ to: 'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6', amount: 100 });
  const [delegateHashData, setDelegateHashData] = useState({ to: 'tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6', amount: 100 });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const {
    connected,
    sendHashLoading,
    signMessageLoading,
    signJWTLoading,
    delegateHashLoading,
  } = walletConnectState;
  const { getWalletKYC, KYCStatus, KYCStatusLoading } = useApp();

  const setPopup = (message, status, duration) => {
    setPopupContent(message);
    if (status) { setPopupStatus(status); }
    if (duration) { setPopupDuration(duration); }
  }

  useEffect(() => {
    // Wallet Connected/Disconnected
    wcs.addEventListener(WINDOW_MESSAGES.CONNECTED, () => {setPopup('Wallet Connected', 'success')});
    wcs.addEventListener(WINDOW_MESSAGES.DISCONNECT, () => {setPopup('Wallet Disconnected', 'failure')});
    // Send Hash Events
    wcs.addEventListener(WINDOW_MESSAGES.TRANSACTION_COMPLETE, ({ sendDetails }) => {
      setPopup(`Transaction Complete! ${sendDetails.amountList[0].amount}${sendDetails.amountList[0].denom} to ${sendDetails.toAddress}`, 'success', 5000);
    });
    wcs.addEventListener(WINDOW_MESSAGES.TRANSACTION_FAILED, ({ error }) => {setPopup(`Transaction Failed! ${error}`, 'failure', 5000)});
    // Sign Message Events
    wcs.addEventListener(WINDOW_MESSAGES.SIGNATURE_COMPLETE, ({ message }) => {setPopup(`Successfully Signed Message! "${message}"`, 'success', 5000)});
    wcs.addEventListener(WINDOW_MESSAGES.SIGNATURE_FAILED, ({ error }) => {setPopup(`Signing Message Failed! ${error}`, 'failure', 5000)});
    // Sign JWT Events
    wcs.addEventListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, ({ signedJWT, address }) => {
      setPopup(`Successfully Signed JWT!`, 'success');
      getWalletKYC(address, signedJWT);
    });
    wcs.addEventListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, ({ error }) => {setPopup(`Signing Message Failed! ${error}`, 'failure', 5000)});
    // Delegate Hash Events
    wcs.addEventListener(WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE, ({ sendDetails }) => {
      setPopup(`Delegation Complete! ${sendDetails.amountList[0].amount}${sendDetails.amountList[0].denom} delegated to ${sendDetails.toAddress}`, 'success', 5000);
    });
    wcs.addEventListener(WINDOW_MESSAGES.DELEGATE_HASH_FAILED, ({ error }) => {setPopup(`Delegation Failed! ${error}`, 'failure', 5000)});
  }, [wcs, getWalletKYC]);

  return (
    <HomeContainer>
        {popupContent && <Popup delay={popupDuration} onClose={() => setPopupContent('')} status={popupStatus}>{popupContent}</Popup>}
        <Header>Provenance.io | WalletConnect-JS | WebDemo</Header>
        <Title>WEBDEMO</Title>
        <Text>Use your phone to manage Provenance.io wallet connections</Text>
        {connected ? (
          <ConnectedContent>
            <Title>Wallet Connected!</Title>
            <Subtitle>WalletConnect Actions:</Subtitle>
            {/* SIGN CUSTOM MESSAGE */}
            <ActionSection>
              <InputContainer width="100%">
                <InputLabel>Message</InputLabel>
                <Input value={signMessageText} placeholder="WalletConnect-JS | WebDemo | Sign Message" onChange={({target}) => setSignMessageText(target.value)} />
              </InputContainer>
              <SmallButton color="PURPLE_PRIMARY" disabled={signMessageLoading} onClick={() => wcs.signMessage(signMessageText)}>
                {signMessageLoading ? 'Sign Message Pending...' : 'Sign Message'}
              </SmallButton>
            </ActionSection>
            {/* SIGN JWT */}
            <ActionSection>
              <Info>Current KYC Status: {KYCStatusLoading ? 'Loading...' : KYCStatus || 'Unknown'}</Info>
              <SmallButton color="GREEN_DARK" disabled={signJWTLoading} onClick={() => wcs.signJWT()}>
                {signJWTLoading ? 'Sign JWT Pending...' : 'Sign JWT'}
              </SmallButton>
            </ActionSection>
            {/* SEND HASH */}
            <ActionSection>
              <InputContainer width="80%">
                <InputLabel>Hash To</InputLabel>
                <Input value={sendHashData.to} placeholder="To" onChange={({ target }) => setSendHashData({...sendHashData, to: target.value})} />
              </InputContainer>
              <InputContainer width="20%">
                <InputLabel>Hash Amount</InputLabel>
                <Input value={sendHashData.amount} placeholder="Amount" onChange={({ target }) => setSendHashData({...sendHashData, amount: target.value})} />
              </InputContainer>
              <SmallButton color="BLUE_PRIMARY" disabled={sendHashLoading} onClick={() => wcs.sendHash(sendHashData)}>
                {sendHashLoading ? 'Send Hash Pending...' : 'Send Hash'}
              </SmallButton>
            </ActionSection>
            {/* DELEGATE HASH */}
            <ActionSection>
              <InputContainer width="80%">
                <InputLabel>Delegate To</InputLabel>
                <Input value={delegateHashData.to} placeholder="To" onChange={({ target }) => setDelegateHashData({...delegateHashData, to: target.value})} />
              </InputContainer>
              <InputContainer width="20%">
                <InputLabel>Amount</InputLabel>
                <Input value={delegateHashData.amount} placeholder="Amount" onChange={({ target }) => setDelegateHashData({...delegateHashData, amount: target.value})} />
              </InputContainer>
              <SmallButton color="ORANGE_PRIMARY" disabled={delegateHashLoading} onClick={() => wcs.delegateHash(delegateHashData)}>
                {delegateHashLoading ? 'Delegate Hash Pending...' : 'Delegate Hash'}
              </SmallButton>
            </ActionSection>
            {/* DISCONNECT WALLET */}
            <ActionSection>
              <Info>Disconnect the connected wallet</Info>
              <SmallButton color="RED_PRIMARY" onClick={wcs.disconnect}>Disconnect</SmallButton>
            </ActionSection>
          </ConnectedContent>
        ): ( 
          <BaseButton onClick={() => wcs.connect()}>Test Connect</BaseButton>
        )}
        <RocketLogo />
    </HomeContainer>
  );
}
