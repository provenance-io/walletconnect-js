import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const Action = ({ method: rawMethod, setResults, fields, windowMessage, multiAction }) => {
  // Check for multisig/multicall message
  const isMulticall = rawMethod.includes('_multicall');
  // If it's a multicall, clean up the method.
  const method = isMulticall ? rawMethod.split('_multicall')[0] : rawMethod;
  const [multicallNo, setMulticallNo] = useState(1);

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
        action: rawMethod,
        status: 'success',
        message: `WalletConnectJS | ${rawMethod} ${isMulticall ? `#${multicallNo}` : ''} Complete`,
        data: result,
      });
    });
    walletConnectService.addListener(windowMsgFailed, (result) => {
      const { error } = result;
      setResults({
        action: rawMethod,
        status: 'failed',
        message: error.message,
        data: result,
      });
    });

    return () => {
      walletConnectService.removeAllListeners(windowMsgComplete);
      walletConnectService.removeAllListeners(windowMsgFailed);
    }
  }, [walletConnectService, setResults, windowMsgComplete, windowMsgFailed, rawMethod, isMulticall, multicallNo]);

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
  const getSendData = (i) => {
    const cleanInputValues = {...inputValues};
    // If this is a multicall method we need to remove the repeat key/value
    if (isMulticall) delete cleanInputValues.repeat;
    // If this is a message method, update message to include # in it
    if (isMulticall && method === 'signMessage') cleanInputValues.message = `${cleanInputValues.message} #${i}`

    const inputKeys = Object.keys(cleanInputValues);
    const jsonInputFilled = cleanInputValues?.json;
    const multipleInputs = inputKeys.length > 1 && !jsonInputFilled;
    // If we just have a single input, we don't need the key, just submit with the first key value (non object)
    return multipleInputs ? cleanInputValues : cleanInputValues[inputKeys[0]];
  }

  const handleSubmit = async () => {
    if (isMulticall) {
      // Multicall messages run one by one as promises
      setMulticallNo(1);
      const { repeat } = inputValues;
      // Build out allCalls array
      for (let i = 1; i <= repeat; i += 1) {
        setMulticallNo(i);
        await walletConnectService[method](getSendData(i)) /* eslint-disable-line no-await-in-loop */
      }
    } else {
      walletConnectService[method]((getSendData()))
    }
  };

  return (
    <ActionContainer loading={loading} inputCount={fields.length}>
      {renderInputs()}
      <Button
        loading={loading}
        onClick={handleSubmit}
      >
        {multiAction ? 'Add' : 'Submit'}
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
  multiAction: PropTypes.bool,
};

Action.defaultProps = {
  fields: [],
  multiAction: false,
};
