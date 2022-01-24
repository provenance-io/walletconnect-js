import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const Action = ({ method, setResults, fields, windowMessage }) => {
  const { walletConnectService, walletConnectState } = useWalletConnect();

  // Get loading state for specific method
  const loading = walletConnectState.loading === method;

  // Get complete and failed messages
  const windowMsgComplete = `${WINDOW_MESSAGES[`${windowMessage}_COMPLETE`]}`;
  const windowMsgFailed = `${WINDOW_MESSAGES[`${windowMessage}_FAILED`]}`;

  // Build state object from fields data (fields are an array of obj, see propTypes)
  const initialInputValues = {};
  fields.forEach(({ name, value }) => {initialInputValues[name] = value});
  const [inputValues, setInputValues] = useState(initialInputValues);

  // Create all event listeners for this method
  useEffect(() => {
    // Delegate Hash Events
    walletConnectService.addListener(windowMsgComplete, (result) => {
      setResults({
        action: method,
        status: 'success',
        message: `WalletConnectJS | ${method} Complete`,
        data: result,
      });
    });
    walletConnectService.addListener(windowMsgFailed, (result) => {
      const { error } = result;
      setResults({
        action: method,
        status: 'failed',
        message: error.message,
        data: result,
      });
    });

    return () => {
      walletConnectService.removeAllListeners(windowMsgComplete);
      walletConnectService.removeAllListeners(windowMsgFailed);
    }
  }, [walletConnectService, setResults, windowMsgComplete, windowMsgFailed, method]);

  const changeInputValue = (name, value) => {
    const newInputValues = {...inputValues};
    newInputValues[name] = value;
    setInputValues(newInputValues);
  };

  const renderInputs = () => fields.map(({ name, width, label, placeholder }) => (
    <Input
      key={name}
      width={width}
      value={inputValues[name]}
      label={label}
      placeholder={placeholder}
      onChange={(value) => changeInputValue(name, value)}
      bottomGap={fields.length > 2 ? true : undefined}
    />
  ));

  // If we only have a single, send the value it without the key (as itself, non obj)
  const getSendData = () => {
    const inputKeys = Object.keys(inputValues);
    const jsonInputFilled = inputValues?.json;
    const multipleInputs = inputKeys.length > 1 && !jsonInputFilled;
    // If we just have a single input, we don't need the key, just submit with the first key value (non object)
    return multipleInputs ? inputValues : inputValues[inputKeys[0]];
  }

  return (
    <ActionContainer loading={loading} inputCount={fields.length}>
      {renderInputs()}
      <Button
        loading={loading}
        onClick={() => walletConnectService[method]((getSendData()))}
      >
        Submit
      </Button>
    </ActionContainer>
  );
};

Action.propTypes = {
  method: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      width: PropTypes.string,
    })
  ),
  windowMessage: PropTypes.string.isRequired,
};

Action.defaultProps = {
  fields: [],
};
