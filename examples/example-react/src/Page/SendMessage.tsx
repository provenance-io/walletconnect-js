import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, ActionGas, Results } from 'Components';
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
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [method, setMethod] = useState('provenance_sendTransaction');
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const sendMessageLoading = loading === 'sendMessage';

  const handleSubmit = () => {
    // Convert input string value to number for price
    const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };
    wcs.sendMessage({ message, description, gasPrice: finalGasData, method });
  };

  const clickUseSampleButton = () => {
    setMessage(
      'ChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKKXRwMWtuc3hmbm4wbHE0OG1tbmtmbmtndGtrOHFueHhkdTB5MnRrbGtoEil0cDFrbnN4Zm5uMGxxNDhtbW5rZm5rZ3Rrazhxbnh4ZHUweTJ0a2xraBoUCgVuaGFzaBILMTAwMDAwMDAwMDA='
    );
  };

  // Create all event listeners for this Action Card method
  useEffect(() => {
    const completeEvent = (result: any) => {
      setResults({
        action: 'sendMessage',
        status: 'success',
        message: 'WalletConnectJS | Send Message Complete',
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: 'sendMessage',
        status: 'failed',
        message: error.message,
        data: result,
      });
    };
    // First load, if windowMessages passed in, create events
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);
    }
  }, [initialLoad, wcs]);

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Send Message"
      description="Pass along an encoded base64 message to the wallet"
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
        value={message}
        label="Base64 Encoded Message"
        placeholder="Enter Base64 Encoded Message"
        onChange={setMessage}
        bottomGap
        disabled={sendMessageLoading}
      />
      <Input
        value={method}
        label="Message method"
        placeholder="Enter the message method"
        onChange={setMethod}
        bottomGap
        disabled={sendMessageLoading}
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
        disabled={!message || !method}
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
