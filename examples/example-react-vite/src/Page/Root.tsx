import { Outlet } from 'react-router-dom';
import { Sidebar } from 'Components';
import styled from 'styled-components';

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

export const Root: React.FC = () => (
  <RootContainer>
    <Sidebar />
    <PageContent>
      <Outlet />
    </PageContent>
  </RootContainer>
);
