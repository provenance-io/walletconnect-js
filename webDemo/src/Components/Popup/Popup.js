import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const PopupContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 100;
`;
const SlideInAnimation = keyframes`
  from { transform: translate(0, -100%); }
  to { transform: translate(0, 0); }
`;
const SlideOutAnimation = keyframes`
  from { transform: translate(0, 0); }
  to { transform: translate(0, -100%); }
`;

const PopupContent = styled.div`
  padding: 20px;
  width: 100%;
  background: ${({ theme, status }) => {
    if (status === 'error' || status === 'failure') return theme.ALERT_ERROR;
    if (status === 'warning') return theme.ALERT_WARNING;
    if (status === 'success') return theme.ALERT_SUCCESS;
    return theme.GREY_PRIMARY;
  }};
  box-shadow: ${({ theme }) => theme.BOX_SHADOW_MAIN };
  border-radius: 0 0 3px 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: 250ms linear ${({ isClosing }) => isClosing ? SlideOutAnimation : SlideInAnimation };
  animation-fill-mode: both;
  opacity: 0.95;
`;
const CloseIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 3rem;
  transform: rotate(45deg);
  cursor: pointer;
`;
const Content = styled.div`
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT_BOLD };
`;

const Popup = ({ className, children, onClose, status, delay }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    let delayCloseTimeout = '';
    // Popup has just opened/been shown
    if (!isClosing) {
      // After delay, show slide up animation, then close self
      delayCloseTimeout = setTimeout(() => { setIsClosing(true); }, delay);
    } else {
      // Popup is already closing, wait 1s to give time for the animation to finish
      setTimeout(() => { onClose() }, 1000);
    }
    return () => {
      // Make sure to clear the timeout if this closes before it runs
      if (delayCloseTimeout) { clearTimeout(delayCloseTimeout); }
    }
  }, [isClosing, onClose, delay]);

  return (
    <PopupContainer className={className}>
      <PopupContent status={status.toLowerCase()} isClosing={isClosing}>
        <CloseIcon onClick={() => setIsClosing(true)}>+</CloseIcon>
        <Content>{children}</Content>
      </PopupContent>
    </PopupContainer>
  );
};

Popup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  status: PropTypes.string,
  delay: PropTypes.number,
};
Popup.defaultProps = {
  className: '',
  children: null,
  onClose: () => {},
  status: 'warning',
  delay: 2000,
};

export default Popup;
