import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const AddMarker = ({ walletConnectService, loading, setPopup }) => {
  const color = '#FF66AA';

  const [denom, setDenom] = useState('my_new_marker_coin');
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    // Delegate Hash Events
    walletConnectService.addListener(WINDOW_MESSAGES.ADD_MARKER_COMPLETE, (result) => {
      const { sendDetails } = result;
      console.log('WalletConnectJS | AddMarker Complete | Result: ', result); // eslint-disable-line no-console
      setPopup(`AddMarker Complete! ${sendDetails}`, 'success', 5000);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.DELEGATE_HASH_FAILED, (result) => {
      const { error } = result;
      console.log('WalletConnectJS | AddMarker Failed | Result: ', result); // eslint-disable-line no-console
      setPopup(`AddMarker Failed! ${error}`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.ADD_MARKER_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.ADD_MARKER_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} loading={loading}>
      <Input
        width="80%"
        value={denom}
        label="Marker Denom"
        placeholder="Denom"
        onChange={setDenom}
      />
      <Input
        width="20%"
        value={amount}
        label="Amount"
        placeholder="Amount"
        onChange={setAmount}
      />
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.addMarker(({ denom, amount }))}
      >
        Add Marker
      </Button>
    </ActionContainer>
  );
};

AddMarker.propTypes = {
  walletConnectService: PropTypes.shape({
    addMarker: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

AddMarker.defaultProps = {
  loading: false,
};
