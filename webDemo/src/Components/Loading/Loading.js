import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { Sprite } from 'Components';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const SearchLoading = styled.div`
  height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  svg {
    animation: ${rotateAnimation} 2s linear infinite;
  }
`;

const Loading = (({ className, size }) => (
  <SearchLoading className={className}>
    <Sprite icon="IN_PROGRESS" size={size} />
  </SearchLoading>
));

Loading.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
  size: '5rem',
};

export default Loading;
