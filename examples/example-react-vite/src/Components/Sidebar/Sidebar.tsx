import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { Checkbox, Navigation, Sprite } from 'Components';
import { CONNECT_URL, ICON_NAMES } from 'consts';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { handleLocalStorageChange } from 'utils';
import { AccountInfo } from './AccountInfo';
import { Countdowns } from './Countdowns';

const FullSidebar = styled.div<{ mobileShow: boolean }>`
  width: 200px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 6px;
  background: ${COLORS.WHITE};
  color: ${COLORS.NEUTRAL_500};
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
  a {
    color: ${COLORS.PRIMARY_500};
  }
`;
const MobileHeader = styled.div`
  display: none;
  background: ${COLORS.WHITE};
  color: ${COLORS.NEUTRAL_500};
  padding: 10px 20px;
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
    color: ${COLORS.PRIMARY_500};
    font-size: 2rem;
    @media screen and (max-width: 500px) {
      font-size: 1.5rem;
    }
  }
  svg {
    cursor: pointer;
    user-select: none;
    transition: 250ms all;
    margin-right: 20px;
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
  font-size: 1.4rem;
  max-width: 100%;
  text-shadow: 0px 0px 4px ${COLORS.BLACK_20};
  a {
    color: inherit;
  }
`;
const RowClickItem = styled.p`
  font-weight: 700;
  font-size: 1rem;
  user-select: none;
  flex-basis: 100%;
  margin-bottom: 16px;
  color: ${COLORS.PRIMARY_400};
  cursor: pointer;
  font-style: italic;
`;
const Version = styled.a`
  font-size: 1rem;
  width: 100%;
  margin-top: 10px;
  font-weight: bold;
`;
const RowSplitter = styled.div`
  margin: 22px 40px 28px 40px;
  border-bottom: 1px solid ${COLORS.NEUTRAL_200};
`;
const ExtraSettings = styled.div`
  padding: 0px 40px;
`;
const SettingRow = styled.div``;

export const Sidebar: React.FC = () => {
  const { walletConnectState } = useWalletConnect();
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [loggingActive, setLoggingActive] = useState(false);
  const [nightmode, setNightmode] = useState(false);
  const { status } = walletConnectState.connection;
  const version = `v${APP_VERSION || 'v?.?.?'}`;

  // Hack: At some later point should implement a real thememing system, for now, the white background just needs a way to be disabled
  const changeBackground = useCallback((currentNightmode: boolean) => {
    if (currentNightmode) {
      document.documentElement.style.filter = 'invert(100%)';
    } else {
      document.documentElement.style.filter = 'invert(0%)';
    }
  }, []);

  useEffect(() => {
    changeBackground(nightmode);
  }, [nightmode]);

  // When mobile, open/close the sidebar with menu hamburger click
  const toggleMobileSidebar = () => {
    setShowSidebarMobile(!showSidebarMobile);
  };

  const destroyLoggingEvents = () => {
    window.removeEventListener('storage', handleLocalStorageChange, true);
  };

  const createLoggingEvents = () => {
    // Destroy the event incase it's already created
    destroyLoggingEvents();
    // Create event listener for localStorage changes
    window.addEventListener('storage', handleLocalStorageChange, true);
  };

  const handleLoggingChange = (newToggleValue: boolean) => {
    // Logging turned on
    if (newToggleValue) {
      setLoggingActive(true);
      createLoggingEvents();
    }
    // Logging turned off
    else {
      setLoggingActive(false);
      destroyLoggingEvents();
    }
  };

  return (
    <>
      <MobileHeader>
        <Sprite
          icon={ICON_NAMES.HAMBURGER}
          size="4rem"
          onClick={toggleMobileSidebar}
          color={showSidebarMobile ? COLORS.PRIMARY_500 : COLORS.NEUTRAL_500}
        />
        <div>
          <a href={CONNECT_URL}>WalletConnect-JS Example App</a>
        </div>
        <a
          href="https://www.npmjs.com/package/@provenanceio/walletconnect-js"
          target="_blank"
          rel="noreferrer"
        >
          {version}
        </a>
      </MobileHeader>
      <FullSidebar
        mobileShow={showSidebarMobile}
        onBlur={() => {
          setShowSidebarMobile(false);
        }}
      >
        <SubtitleSection>
          <Subtitle>
            <a href={CONNECT_URL}>WalletConnect-JS Example App</a>
          </Subtitle>
          <Version
            href="https://www.npmjs.com/package/@provenanceio/walletconnect-js"
            target="_blank"
            rel="noreferrer"
          >
            {version}
          </Version>
        </SubtitleSection>
        {status === 'connected' && (
          <>
            <Countdowns />
            <RowSplitter />
            <AccountInfo />
            <RowSplitter />
          </>
        )}
        <Navigation />
        <RowSplitter />
        <ExtraSettings>
          <SettingRow>
          {walletConnectState && (
          <RowClickItem onClick={() => {console.log('walletConnectState: ', walletConnectState);}}>Log current state</RowClickItem>
          )}
          </SettingRow>
          <SettingRow>
            <Checkbox
              checked={loggingActive}
              onChange={handleLoggingChange}
              label="Logging"
            />
          </SettingRow>
          <SettingRow>
            <Checkbox
              checked={nightmode}
              onChange={setNightmode}
              label="Nightmode"
            />
          </SettingRow>
        </ExtraSettings>
      </FullSidebar>
    </>
  );
};
