import ReactDom from 'react-dom';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalElement = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalChildren = styled.div``;

export const Modal = ({ children, isOpen, close }) => {
  const targetElement = document.getElementById('portal');
  const modalElement = useRef(null);
  // When this modal is open, prevent body from scrolling
  useEffect(() => {
    const documentElement = document.body;
    if (isOpen && documentElement) {
      modalElement.current.focus();
      documentElement.style.overflow = 'hidden';
    } else {
      documentElement.style.overflow = 'auto';
    }

    return () => { documentElement.style.overflow = 'auto';}
  }, [isOpen]);

  const handleClose = (e) => {
    // Clicking outside of modal
    // use mousedown since if you start a clickdrag and end on the background it would trigger onclick and close
    if (e.type === 'mousedown' || (e.type === 'keyup' && e.code === 'Escape')) close();
  };

  return isOpen ? ReactDom.createPortal(
    <ModalElement onKeyUp={handleClose} onMouseDown={handleClose} ref={modalElement}>
      <ModalChildren onMouseDown={(e) => e.stopPropagation()}>{children}</ModalChildren>
    </ModalElement>,
    targetElement,
  ) : null;
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
