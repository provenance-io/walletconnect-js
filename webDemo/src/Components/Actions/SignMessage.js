import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const SignMessage = ({ walletConnectService, loading, setPopup }) => {
  const color = '#3923A9';

  const [message, setMessage] = useState('WalletConnect-JS | WebDemo | Sign Message');

  useEffect(() => {
    // Sign Message Events
    walletConnectService.addListener(WINDOW_MESSAGES.SIGNATURE_COMPLETE, ({ message: resultMessage }) => {
      setPopup(`Successfully Signed Message! "${resultMessage}"`, 'success', 5000);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.SIGNATURE_FAILED, ({ error }) => {
      setPopup(`Signing Message Failed! ${error}`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.SIGNATURE_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.SIGNATURE_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} loading={loading}>
      <Input
        value={message}
        label="Message"
        placeholder="WalletConnect-JS | WebDemo | Sign Message"
        onChange={setMessage}
      />
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.signMessage(message)}
      >
        Sign Message
      </Button>
    </ActionContainer>
  );
};

SignMessage.propTypes = {
  walletConnectService: PropTypes.shape({
    signMessage: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

SignMessage.defaultProps = {
  loading: false,
};
