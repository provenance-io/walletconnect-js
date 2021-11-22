import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const SendHash = ({ walletConnectService, loading, setPopup }) => {
  const color = '#498AFD';
  
  const [hashTo, setHashTo] = useState('tp1vxlcxp2vjnyjuw6mqn9d8cq62ceu6lllpushy6');
  const [hashAmount, setHashAmount] = useState(100);

  useEffect(() => {
    // Send Hash Events
    walletConnectService.addListener(WINDOW_MESSAGES.TRANSACTION_COMPLETE, ({ sendDetails }) => {
      setPopup(`Transaction Complete! ${sendDetails.amountList[0].amount}${sendDetails.amountList[0].denom} to ${sendDetails.toAddress}`, 'success', 5000);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.TRANSACTION_FAILED, ({ error }) => {
      setPopup(`Transaction Failed! ${error}`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.TRANSACTION_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.TRANSACTION_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} loading={loading}>
      <Input
        width="80%"
        value={hashTo}
        label="Hash To"
        placeholder="To"
        onChange={setHashTo}
      />
      <Input
        width="20%"
        value={hashAmount}
        label="Amount"
        placeholder="Amount"
        onChange={setHashAmount}
      />
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.sendHash(({ to: hashTo, amount: hashAmount }))}
      >
        Send Hash
      </Button>
    </ActionContainer>
  );
};

SendHash.propTypes = {
  walletConnectService: PropTypes.shape({
    sendHash: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

SendHash.defaultProps = {
  loading: false,
};
