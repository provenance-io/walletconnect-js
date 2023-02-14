import styled from 'styled-components';
import { useState } from 'react';
import { useWalletConnect, ProvenanceMethod } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, ActionGas, Results, Dropdown } from 'Components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

const TestMessage = styled.span`
  font-size: 1rem;
  color: ${COLORS.PRIMARY_400};
  cursor: pointer;
  font-style: italic;
  margin-bottom: 8px;
`;

export const SendMessage: React.FC = () => {
  const [b64Message, setB64Message] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [method, setMethod] = useState<ProvenanceMethod>(
    'provenance_sendTransaction'
  );
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const sendMessageLoading = pendingMethod === 'sendMessage';


  const disableSubmit = () => {
    return ((!b64Message && !message) || !method) ||
          ((!!b64Message && !!message)) ||
          (!!message && !isJSON(message));
  }

  const handleSubmit = async () => {
    // Convert input string value to number for price
    const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };

    const result = await wcs.sendMessage({
      message: !!message ? message : b64Message,
      description,
      gasPrice: finalGasData,
      method,
    });
    setResults({
      action: 'sendMessage',
      status: result.error ? 'failed' : 'success',
      message: result.error
        ? result.error
        : 'WalletConnectJS | Send Message Complete',
      data: result,
    });
  };

  const messageError = () => {
    if (!!b64Message && !!message) {
      return 'Only 1 of Base 64 Encoded Message or Plain Message allowed.';
    }
    if (!isJSON(message)) {
      return 'Not valid JSON.';
    }
    return '';
  }

  const methodError = () => {
    if(!method) {
      return 'Method must be entered';
    }
    if(method === customMethod) {
      return 'Invalid method. Select a Common Method Message or enter a custom method in Send Message Method.';
    }
    return '';
  }

  const isJSON = (data:string) => {
    try {
      if(!!data) {
        JSON.parse(data);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  const clickUseSampleButton = () => {
    setB64Message(
      'ChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKKXRwMWtuc3hmbm4wbHE0OG1tbmtmbmtndGtrOHFueHhkdTB5MnRrbGtoEil0cDFrbnN4Zm5uMGxxNDhtbW5rZm5rZ3Rrazhxbnh4ZHUweTJ0a2xraBoUCgVuaGFzaBILMTAwMDAwMDAwMDA='
    );
  };

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Send Message"
      description="Pass along a message to the wallet"
      status={results?.status}
    >
      <TestMessage
        onClick={clickUseSampleButton}
        title="Message: Send 10 Hash to tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh"
      >
        Click here to use sample message
      </TestMessage>
      <Input
        width="100%"
        value={b64Message}
        label="Base64 Encoded Message"
        placeholder="Enter Base64 Encoded Message"
        onChange={setB64Message}
        bottomGap
        disabled={sendMessageLoading}
      />
      <Input
          width="100%"
          value={message}
          label="Plain JSON Message"
          placeholder="Plain Message"
          onChange={setMessage}
          bottomGap
          disabled={sendMessageLoading}
          error={messageError()}
      />
      <Dropdown
        value={method}
        label="Common Message Methods"
        onChange={setMethod}
        bottomGap
        options={[customMethod,'provenance_sign', 'provenance_sendTransaction']}
      />
      <Input
          value={method}
          label="Send Message Method"
          placeholder="Enter Message Method"
          onChange={setMethod}
          bottomGap
          disabled={sendMessageLoading}
          error={methodError()}
      />

      <Input
        value={description}
        label="Wallet message description (Optional)"
        placeholder="Enter message description"
        onChange={setDescription}
        bottomGap
        disabled={sendMessageLoading}
      />
      <ActionGas setGasData={setGasData} gasData={gasData} />
      <Button
        loading={sendMessageLoading}
        onClick={handleSubmit}
        disabled={disableSubmit()}
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
