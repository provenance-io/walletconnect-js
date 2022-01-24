import styled from 'styled-components';
import { AccountInfo } from 'Components';
import FIGURE_LOGO from 'img/figureLogo.svg'
import { REACT_APP_WCJS_VERSION } from '../../version';

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;
const MainSection = styled.div`
  flex-grow: 1;
  background: white;
  padding: 0 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`;

export const Header = ({ bridgeUrl }) => ( // eslint-disable-line react/prop-types
  <HeaderContainer>
    <MainSection>
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
    </MainSection>
  </HeaderContainer>
);
