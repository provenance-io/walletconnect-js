import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button, InputB64, Input } from 'Components';
import { ActionContainer } from './ActionContainer';

export const Action = ({ method: rawMethod, setResults, fields, windowMessage, multiAction, gas }) => {
  // Check for multisig/multicall message
  const isMulticall = rawMethod.includes('_multicall');
  // If it's a multicall, clean up the method.
  const method = isMulticall ? rawMethod.split('_multicall')[0] : rawMethod;
  const [multicallNo, setMulticallNo] = useState(1);
  const [decodeOpen, setDecodeOpen] = useState(false);
  const [figureGasPrice, setFigureGasPrice] = useState({ gasPrice: '', gasPriceDenom: '' });
  // Build state object from fields data (fields are an array of obj, see propTypes)
  const initialInputValues = {};
  fields.forEach(({ name, value }) => {initialInputValues[name] = value});
  const [inputValues, setInputValues] = useState(initialInputValues);

  const fetchGas = async () => {
    const response = await fetch('https://test.figure.tech/figure-gas-price');
    return response.json();
  }

  const changeInputValue = (name, value) => {
    const newInputValues = {...inputValues};
    newInputValues[name] = value;
    setInputValues(newInputValues);
  };

  // Pull figureGasPrice from API
  useEffect(() => {
    // Only do this if we have gas in this method/action
    if (gas && (figureGasPrice.gasPrice === '' || figureGasPrice.gasPriceDenom === '')) {
      fetchGas().then((data) => {
        setFigureGasPrice(data);
        setInputValues({ ...inputValues, gasPrice: data.gasPrice, gasPriceDenom: data.gasPriceDenom })
      }). catch(() => {
        setFigureGasPrice({ gasPrice: '', gasPriceDenom: '' });
        setInputValues({ ...inputValues, gasPrice: null, gasPriceDenom: null })
      })
    }
  }, [gas, inputValues, figureGasPrice]);

  const { walletConnectService, walletConnectState } = useWalletConnect();

  // Get loading state for specific method
  const loading = walletConnectState.loading === method;

  // Get complete and failed messages
  const windowMsgComplete = `${WINDOW_MESSAGES[`${windowMessage}_COMPLETE`]}`;
  const windowMsgFailed = `${WINDOW_MESSAGES[`${windowMessage}_FAILED`]}`;

  // Create all event listeners for this method
  useEffect(() => {
    const completeEvent = (result) => {
      setResults({
        action: rawMethod,
        status: 'success',
        message: `WalletConnectJS | ${rawMethod} ${isMulticall ? `#${multicallNo}` : ''} Complete`,
        data: result,
      });
    };
    const failEvent = (result) => {
      const { error } = result;
      setResults({
        action: rawMethod,
        status: 'failed',
        message: error.message,
        data: result,
      });
    }
    walletConnectService.addListener(windowMsgComplete, completeEvent);
    walletConnectService.addListener(windowMsgFailed, failEvent);

    return () => {
      walletConnectService.removeListener(windowMsgComplete, completeEvent);
      walletConnectService.removeListener(windowMsgFailed, failEvent);
    }
  }, [walletConnectService, setResults, windowMsgComplete, windowMsgFailed, rawMethod, isMulticall, multicallNo]);

  const renderInputs = () => fields.map(({ name, width, label, placeholder, base64 }) => {
    if (base64) return (
      <InputB64
        key={name}
        width={width}
        value={inputValues[name]}
        label={label}
        placeholder={placeholder}
        onChange={(value) => changeInputValue(name, value)}
        bottomGap={fields.length > 2 ? true : undefined}
        decodeOpen={decodeOpen}
        setDecodeOpen={setDecodeOpen}
      />
    )
    if (name === 'gasPrice') return (
      <Input
        key={name}
        width={width}
        value={inputValues[name]}
        label={`Gas Price (${Number(inputValues[name]) === figureGasPrice.gasPrice || inputValues[name] === '' ? 'Figure Gas Price' : 'Custom Gas Price'})`}
        placeholder={placeholder}
        onChange={(value) => changeInputValue(name, value)}
        bottomGap={fields.length > 2 ? true : undefined}
      />
    )
    if (name === 'gasPriceDenom') return (
      <Input
        key={name}
        width={width}
        value={inputValues[name]}
        label={`Gas Denom (${inputValues[name] === figureGasPrice.gasPriceDenom || inputValues[name] === '' ? 'Figure Gas Denom' : 'Custom Gas Denom'})`}
        placeholder={placeholder}
        onChange={(value) => changeInputValue(name, value)}
        bottomGap={fields.length > 2 ? true : undefined}
      />
    )
    return (
      <Input
        key={name}
        width={width}
        value={inputValues[name]}
        label={label}
        placeholder={placeholder}
        onChange={(value) => changeInputValue(name, value)}
        bottomGap={fields.length > 2 ? true : undefined}
      />
    )
  });

  // If we only have a single, send the value it without the key (as itself, non obj)
  const getSendData = (i) => {
    const cleanInputValues = {...inputValues};
    // If this data includes a gas fee, bundle it correctly
    if (gas) {
      const gasPrice = {
        gasPrice: Number(cleanInputValues.gasPrice) || figureGasPrice.gasPrice,
        gasPriceDenom: cleanInputValues.gasPriceDenom || figureGasPrice.gasPriceDenom,
      };
      delete cleanInputValues.gasPrice;  
      delete cleanInputValues.gasPriceDenom;
      cleanInputValues.gasPrice = gasPrice;
    }
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
        const sendData = getSendData(i);
        await walletConnectService[method](sendData) /* eslint-disable-line no-await-in-loop */
      }
    } else {
      const sendData = getSendData();
      walletConnectService[method](sendData)
    }
  };

  return (
    <ActionContainer loading={loading} inputCount={fields.length}>
      {renderInputs()}
      <Button
        loading={loading}
        onClick={handleSubmit}
        disabled={decodeOpen}
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
  gas: PropTypes.bool,
};

Action.defaultProps = {
  fields: [],
  multiAction: false,
  gas: false,
};
