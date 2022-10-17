import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from 'Components';
import styled from 'styled-components';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { useEffect } from 'react';
import { CONNECT_URL } from 'consts';

const RootContainer = styled.div`
  position: relative;
`;
const PageContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0 0 0;
  margin-left: 200px;
  @media screen and (max-width: 1080px) {
    padding: 40px;
  }
  @media screen and (max-width: 800px) {
    margin-left: 0;
  }
`;

export const Root: React.FC = () => {
  const { walletConnectState } = useWalletConnect();
  const { connected } = walletConnectState;
  const navigate = useNavigate();
  const location = useLocation();

  // If we are disconnected/not connected, redirect ot the connect page
  useEffect(() => {
    const connectPage = location.pathname.includes('/connect');
    if (!connected && !connectPage) navigate(CONNECT_URL);
  }, [connected, navigate, location.pathname]);

  return (
    <RootContainer>
      <Sidebar />
      <PageContent>
        <Outlet />
      </PageContent>
    </RootContainer>
  );
};
