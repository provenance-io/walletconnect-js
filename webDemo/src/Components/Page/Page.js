import styled from 'styled-components';
import PropTypes from 'prop-types';

const PageContainer = styled.div`
  padding: 60px 80px;
  background: ${({ theme }) => theme.PAGE_BG };
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Page = ({ className, children }) => (
  <PageContainer className={className}>
    {children}
  </PageContainer>
);

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
Page.defaultProps = {
  className: '',
  children: null,
};

export default Page;