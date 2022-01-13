import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

const Note = styled.div`
  flex-basis: 100%;
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 20px;
  color: #42368E;
  font-style: italic;
  text-align: center;
`;

export const Action = ({ method, setPopup, fields, buttonTxt, windowMessage, json }) => {
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
      console.log(`WalletConnectJS | ${method} Complete | Result: `, result); // eslint-disable-line no-console
      setPopup(`${method} Complete! See console for result details`, 'success', 5000);
    });
    walletConnectService.addListener(windowMsgFailed, (result) => {
      const { error } = result;
      console.log(`WalletConnectJS | ${method} Failed | Result: `, result); // eslint-disable-line no-console
      setPopup(`${method} Failed! ${error} | See console for more details`, 'failure', 5000);
    });

    return () => {
      walletConnectService.removeAllListeners(windowMsgComplete);
      walletConnectService.removeAllListeners(windowMsgFailed);
    }
  }, [walletConnectService, setPopup, windowMsgComplete, windowMsgFailed, method]);

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
    // When json, parse the data before submitting
    if (json) {
      if (multipleInputs) {
        // Convert all data away from json string
        const parsedData = { ...inputValues };
        const parsedDataKeys = Object.keys(parsedData);
        parsedDataKeys.forEach(key => {
          const value = parsedData[key];
          const destringValue = value.substring(1, value.length-1);
          parsedData[key] = JSON.parse(destringValue);
        });
        return parsedData;
      } 
      // Return first item parsed (first item is either json, or customAction json)
      const firstValue = inputValues[inputKeys[0]];
      const destringFirstValue = firstValue.substring(1, firstValue.length-1);
      return JSON.parse(destringFirstValue);
    }
    // If we just have a single input, we don't need the key, just submit with the first key value (non object)
    return multipleInputs ? inputValues : inputValues[inputKeys[0]];
  }

  return (
    <ActionContainer loading={loading} inputCount={fields.length}>
      {json && <Note>Note: This method demo requires all fields to be entered as JSON strings</Note>}
      {renderInputs()}
      <Button
        loading={loading}
        onClick={() => walletConnectService[method]((getSendData()))}
      >
        {buttonTxt}
      </Button>
    </ActionContainer>
  );
};

Action.propTypes = {
  method: PropTypes.string.isRequired,
  setPopup: PropTypes.func.isRequired,
  json: PropTypes.bool,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      width: PropTypes.string,
    })
  ),
  buttonTxt: PropTypes.string.isRequired,
  windowMessage: PropTypes.string.isRequired,
};

Action.defaultProps = {
  fields: [],
  json: false,
};
