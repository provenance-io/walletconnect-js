import styled from 'styled-components';
import { AccountInfo, Subheader } from 'Components';
import PROVENANCE_LOGO from 'img/provenanceLogo.svg';
import { REACT_APP_WCJS_VERSION } from '../../version';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  background: radial-gradient(
    circle,
    rgba(40, 40, 80, 0.8) 11%,
    rgba(51, 54, 129, 0.5) 25%,
    rgba(3, 4, 10, 1) 100%
  );
  padding: 20px 40px;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  z-index: 100;
  box-shadow: 0px 1px 10px 2px rgba(0, 0, 0, 0.25);
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
const Title = styled.div`
  font-size: 2rem;
  font-weight: 400;
  line-height: 2rem;
  color: #ffffff;
  margin-right: 20px;
  @media (max-width: 1380px) {
    font-size: 1.6rem;
  }
  @media (max-width: 1280px) {
    font-size: 1.3rem;
  }
`;
const LogoImg = styled.img`
  height: 20px;
  width: auto;
  margin-right: 20px;
`;

interface Props {
  bridgeUrl: string;
}

export const Header: React.FC<Props> = (
  { bridgeUrl } // eslint-disable-line react/prop-types
) => (
  <Wrapper>
    <Group>
      <Logo>
        <LogoImg src={PROVENANCE_LOGO} alt="Provenance Logo" />
      </Logo>
      <Title>WalletConnect-JS Demo</Title>
      <Title>
        <a
          href="https://www.npmjs.com/package/@provenanceio/walletconnect-js"
          target="_blank"
          rel="noreferrer"
        >
          v{REACT_APP_WCJS_VERSION || 'v??.??.??'}
        </a>
      </Title>
    </Group>
    <Group>
      <AccountInfo bridgeUrl={bridgeUrl} />
    </Group>
    <Subheader />
  </Wrapper>
);
