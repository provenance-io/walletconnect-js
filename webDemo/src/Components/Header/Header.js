import styled from 'styled-components';
import { AccountInfo } from 'Components';
import FIGURE_LOGO from 'img/figureLogo.svg'
import { REACT_APP_WCJS_VERSION } from '../../version';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  padding: 20px 40px;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  z-index:100;
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
const Group = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Separator = styled.div`
  color: #191C27;
  font-weight: 100;
  font-size: 1.3rem;
  line-height: 1.3rem;
  margin: 0 10px; 
`;
const Title = styled.div`
  font-size: 2.0rem;
  font-weight: 400;
  line-height: 2.0rem;
  color: #191C27;
  @media (max-width: 1380px) {
    font-size: 1.6rem;
  }
  @media (max-width: 1280px) {
    font-size: 1.3rem;
  }
`;

export const Header = ({ bridgeUrl }) => ( // eslint-disable-line react/prop-types
  <Wrapper>
    <Group>
      <Logo><img src={FIGURE_LOGO} alt="Figure Logo" /></Logo>
      <Separator size="small">|</Separator>
      <Title>Figure Tech</Title>
      <Separator size="small">|</Separator>
      <Title>WalletConnect-JS Demo</Title>
      <Separator size="small">|</Separator>
      <Title><a href="https://www.npmjs.com/package/@provenanceio/walletconnect-js" target="_blank" rel="noreferrer">v{REACT_APP_WCJS_VERSION || 'v??.??.??'}</a></Title>
    </Group>
    <Group>
      <AccountInfo bridgeUrl={bridgeUrl} />
    </Group>
  </Wrapper>
);
