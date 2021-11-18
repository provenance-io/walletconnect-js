import styled from 'styled-components';
import PropTypes from 'prop-types';
import { breakpoints } from 'consts';

const PageContainer = styled.div`
  padding: 60px 80px;
  background: ${({ theme }) => theme.PAGE_BG };
  display: flex;
  align-items: center;
  justify-content: center;
  @media ${breakpoints.down('md')} {
    padding: 20px 10px;
  }
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