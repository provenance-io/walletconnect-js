import styled from 'styled-components';
import { Navigation, Sprite } from 'Components';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';
import { Countdowns } from './Countdowns';
import { AccountInfo } from './AccountInfo';
import { useState } from 'react';

const FullSidebar = styled.div<{ mobileShow: boolean }>`
  width: 200px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 6px;
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  @media screen and (max-width: 800px) {
    display: ${({ mobileShow }) => (mobileShow ? 'block' : 'none')};
    padding-top: 40px;
    box-shadow: ${COLORS.BLACK_10} 4px 0px 8px;
  }
`;
const MobileHeader = styled.div`
  display: none;
  background: ${COLORS.WHITE};
  padding: 10px 40px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 200;
  box-shadow: ${COLORS.BLACK_10} 0px 4px 8px;
  @media screen and (max-width: 800px) {
    display: flex;
  }
  div,
  a {
    font-size: 2rem;
    @media screen and (max-width: 500px) {
      font-size: 1.5rem;
    }
  }
  svg {
    cursor: pointer;
    user-select: none;
    transition: 250ms all;
  }
`;

const SubtitleSection = styled.div`
  margin: 58px 0 0 40px;
  display: flex;
  flex-wrap: wrap;
  font-weight: 700;
  margin-bottom: 80px;
`;
const Subtitle = styled.p`
  color: ${COLORS.NEUTRAL_650};
  font-size: 1.4rem;
  max-width: 100%;
  text-shadow: 0px 0px 4px ${COLORS.BLACK_20};
`;
const Version = styled.a`
  font-size: 1rem;
  width: 100%;
  font-weight: bold;
`;
const RowSplitter = styled.div`
  margin: 22px 40px 28px 40px;
  border-bottom: 1px solid ${COLORS.NEUTRAL_200};
`;

export const Sidebar: React.FC = () => {
  const { walletConnectState } = useWalletConnect();
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const { connected } = walletConnectState;

  const toggleMobileSidebar = (status?: boolean) => {
    setShowSidebarMobile(!showSidebarMobile);
  };

  return (
    <>
      <MobileHeader>
        <Sprite
          icon={ICON_NAMES.HAMBURGER}
          size="4rem"
          onClick={toggleMobileSidebar}
          spin={showSidebarMobile ? 15 : 0}
        />
        <div>WalletConnect-JS Example App</div>
        <a
          href="https://www.npmjs.com/package/@provenanceio/walletconnect-js"
          target="_blank"
          rel="noreferrer"
        >
          v{process.env.REACT_APP_VERSION || 'v??.??.??'}
        </a>
      </MobileHeader>
      <FullSidebar
        mobileShow={showSidebarMobile}
        onClick={() => {
          setShowSidebarMobile(false);
        }}
      >
        <SubtitleSection>
          <Subtitle>WalletConnect-JS Example App</Subtitle>
          <Version
            href="https://www.npmjs.com/package/@provenanceio/walletconnect-js"
            target="_blank"
            rel="noreferrer"
          >
            v{process.env.REACT_APP_VERSION || 'v??.??.??'}
          </Version>
        </SubtitleSection>
        {connected && (
          <>
            <Countdowns />
            <RowSplitter />
            <AccountInfo />
            <RowSplitter />
          </>
        )}
        <Navigation />
      </FullSidebar>
    </>
  );
};
