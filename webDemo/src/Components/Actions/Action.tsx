import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import { Button, Input } from 'Components';
import { ActionContainer } from './ActionContainer';
import { Action as ActionType } from 'types';

interface Props extends ActionType {
  setResults: (results: any) => void;
}

export const Action: React.FC<Props> = ({
  method,
  setResults,
  fields,
  windowMessage,
  multiAction,
  gas,
}) => {
  const [figureGasPrice, setFigureGasPrice] = useState({
    gasPrice: '',
    gasPriceDenom: '',
  });
  // Build state object from fields data (fields are an array of obj, see propTypes)
  const initialInputValues = {} as { [key: string]: string };
  fields.forEach(({ name, value }) => {
    initialInputValues[name] = value;
  });
  const [inputValues, setInputValues] = useState(initialInputValues);

  const fetchGas = async () => {
    const response = await fetch('https://test.figure.tech/figure-gas-price');
    return response.json();
  };

  const changeInputValue = (name: string, value: string) => {
    const newInputValues = { ...inputValues };
    newInputValues[name] = value || '';
    setInputValues(newInputValues);
  };

  // Pull figureGasPrice from API
  useEffect(() => {
    // Only do this if we have gas in this method/action
    if (
      gas &&
      (figureGasPrice.gasPrice === '' || figureGasPrice.gasPriceDenom === '')
    ) {
      fetchGas()
        .then((data) => {
          setFigureGasPrice(data);
          setInputValues({
            ...inputValues,
            gasPrice: data.gasPrice,
            gasPriceDenom: data.gasPriceDenom,
          });
        })
        .catch(() => {
          setFigureGasPrice({ gasPrice: '', gasPriceDenom: '' });
          setInputValues({
            ...inputValues,
            gasPrice: '',
            gasPriceDenom: '',
          });
        });
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
    const completeEvent = (result: any) => {
      setResults({
        action: method,
        status: 'success',
        message: `WalletConnectJS | ${method} Complete`,
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: method,
        status: 'failed',
        message: error.message,
        data: result,
      });
    };
    walletConnectService.addListener(windowMsgComplete, completeEvent);
    walletConnectService.addListener(windowMsgFailed, failEvent);

    return () => {
      walletConnectService.removeListener(windowMsgComplete, completeEvent);
      walletConnectService.removeListener(windowMsgFailed, failEvent);
    };
  }, [walletConnectService, setResults, windowMsgComplete, windowMsgFailed, method]);

  const renderInputs = () =>
    fields.map(({ name, width, label, placeholder }) => (
      <Input
        key={name}
        width={width}
        value={inputValues[name]}
        label={label}
        placeholder={placeholder}
        onChange={(value: string) => changeInputValue(name, value)}
        bottomGap={gas || fields.length > 2 ? true : undefined}
      />
    ));

  // If we only have a single, send the value it without the key (as itself, non obj)
  const getSendData = (index?: number) => {
    const cleanInputValues = { ...inputValues } as any;
    // If this data includes a gas fee, bundle it correctly
    if (gas) {
      const gasPrice = {
        gasPrice: Number(cleanInputValues.gasPrice) || figureGasPrice.gasPrice,
        gasPriceDenom:
          cleanInputValues.gasPriceDenom || figureGasPrice.gasPriceDenom,
      };
      delete cleanInputValues.gasPrice;
      delete cleanInputValues.gasPriceDenom;
      cleanInputValues.gasPrice = gasPrice;
    }

    const inputKeys = Object.keys(cleanInputValues);
    const jsonInputFilled = cleanInputValues?.json;
    const multipleInputs = (inputKeys.length > 1 || gas) && !jsonInputFilled; // gas will always set the inputs to 3+
    // If we just have a single input, we don't need the key, just submit with the first key value (non object)
    return multipleInputs ? cleanInputValues : cleanInputValues[inputKeys[0]];
  };

  const renderGasInputs = () => (
    <>
      <Input
        key="gasPrice"
        width="50%"
        value={inputValues.gasPrice || ''}
        label={`Gas Price (${
          Number(inputValues.gasPrice) === Number(figureGasPrice.gasPrice) ||
          inputValues.gasPrice === ''
            ? 'Figure Gas Price'
            : 'Custom Gas Price'
        })`}
        placeholder="Gas Price (Defaults to Figure Gas Price)"
        onChange={(value: string) => changeInputValue('gasPrice', value)}
        bottomGap
      />
      <Input
        key="gasPriceDenom"
        width="50%"
        value={inputValues.gasPriceDenom || ''}
        label={`Gas Denom (${
          inputValues.gasPriceDenom === figureGasPrice.gasPriceDenom ||
          inputValues.gasPriceDenom === ''
            ? 'Figure Gas Denom'
            : 'Custom Gas Denom'
        })`}
        placeholder="Gas Denom (Defaults to Figure Gas Denom)"
        onChange={(value: string) => changeInputValue('gasPriceDenom', value)}
        bottomGap
      />
    </>
  );

  const handleSubmit = async () => {
    const sendData = getSendData();
    walletConnectService[method](sendData as never);
  };

  return (
    <ActionContainer loading={loading} inputCount={gas ? 3 : fields.length}>
      {renderInputs()}
      {gas && renderGasInputs()}
      <Button loading={loading} onClick={handleSubmit}>
        {multiAction ? 'Add' : 'Submit'}
      </Button>
    </ActionContainer>
  );
};
