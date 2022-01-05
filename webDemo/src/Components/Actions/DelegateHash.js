import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const DelegateHash = ({ walletConnectService, loading, setPopup }) => {
  const color = '#FFAA66';

  const [delegateTo, setDelegateTo] = useState('tpvaloper1tgq6cpu6hmsrvkvdu82j99tsxxw7qqajn843fe');
  const [delegateAmount, setDelegateAmount] = useState(1);

  useEffect(() => {
    // Delegate Hash Events
    walletConnectService.addListener(WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE, (result) => {
      const { sendDetails } = result;
      const { amount: amountObj, delegatorAddress, validatorAddress } = sendDetails;
      const { denom, amount } = amountObj;
      console.log('WalletConnectJS | DelegateHash Complete | Result: ', result); // eslint-disable-line no-console
      setPopup(`Delegation Complete! ${delegatorAddress} delegated ${amount}${denom} to ${validatorAddress}`, 'success', 5000);
    });
    walletConnectService.addListener(WINDOW_MESSAGES.DELEGATE_HASH_FAILED, (result) => {
      const { error } = result;
      console.log('WalletConnectJS | DelegateHash Failed | Result: ', result); // eslint-disable-line no-console
      setPopup(`Delegation Failed! ${error}`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE);
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.DELEGATE_HASH_FAILED);
    }
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} loading={loading}>
      <Input
        width="80%"
        value={delegateTo}
        label="Delegate To"
        placeholder="To"
        onChange={setDelegateTo}
      />
      <Input
        width="20%"
        value={delegateAmount}
        label="Amount"
        placeholder="Amount"
        onChange={setDelegateAmount}
      />
      <Button
        color={color}
        loading={loading}
        onClick={() => walletConnectService.delegateHash(({ validatorAddress: delegateTo, amount: delegateAmount }))}
      >
        Delegate Hash
      </Button>
    </ActionContainer>
  );
};

DelegateHash.propTypes = {
  walletConnectService: PropTypes.shape({
    delegateHash: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool,
  setPopup: PropTypes.func.isRequired,
};

DelegateHash.defaultProps = {
  loading: false,
};
