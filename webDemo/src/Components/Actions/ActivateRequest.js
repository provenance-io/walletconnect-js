import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const ActivateRequest = ({ walletConnectService, loading, setPopup }) => {
  const color = '#FFF2AF';

  const [denom, setDenom] = useState('myNewMarkerCoin');
  const [administrator, setAdministrator] = useState('tp194r5us3l3yg7rpwepn9c7awgcesp5kp84r5lye');

  useEffect(() => {
    // Delegate Hash Events
    walletConnectService.addListener(WINDOW_MESSAGES.ACTIVATE_REQUEST_COMPLETE, (result) => {
      const { sendDetails } = result;
      const { denom: denomResult, amount: amountResult } = sendDetails;
      console.log('WalletConnectJS | Activate Request Complete | Result: ', result); // eslint-disable-line no-console
      setPopup(`Activate Request Complete! Created ${amountResult} new ${denomResult} marker${amountResult > 1 ? 's' : ''}`, 'success', 5000);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.ACTIVATE_REQUEST_FAILED, (result) => {
      const { error } = result;
      console.log('WalletConnectJS | Activate Request Failed | Result: ', result); // eslint-disable-line no-console
      setPopup(`Activate Request Failed! ${error}`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.ACTIVATE_REQUEST_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.ACTIVATE_REQUEST_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} loading={loading}>
      <Input
        width="40%"
        value={denom}
        label="Marker Denom"
        placeholder="Denom"
        onChange={setDenom}
      />
      <Input
        width="60%"
        value={administrator}
        label="Adminstrator"
        placeholder="Administrator"
        onChange={setAdministrator}
      />
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.activateRequest(({ denom, administrator }))}
      >
        Activate Request
      </Button>
    </ActionContainer>
  );
};

ActivateRequest.propTypes = {
  walletConnectService: PropTypes.shape({
    activateRequest: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

ActivateRequest.defaultProps = {
  loading: false,
};
