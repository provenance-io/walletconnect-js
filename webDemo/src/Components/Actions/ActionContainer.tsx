import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  padding: ${({ inputCount }) => inputCount ? '34px 20px 20px 20px' : '20px' };
  background: ${({ isLoading }) => isLoading ? '#CCCCCC' : `#dddddd` };
  border-radius: 5px;
  display: flex;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  ${({ noMargin }) => !noMargin && 'margin-bottom: 30px;' }
  flex-wrap: ${({ inputCount }) => inputCount > 2 ? 'wrap' : 'nowrap'};
  @media (max-width: 1150px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

export const ActionContainer = ({ children, loading, inputCount }) => (
  <Container inputCount={inputCount} isLoading={loading}>{children}</Container>
);

ActionContainer.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  inputCount: PropTypes.number,
};
ActionContainer.defaultProps = {
  children: null,
  loading: false,
  inputCount: 0,
};
