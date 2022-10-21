import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results, ActionGas } from 'Components';
import { ICON_NAMES } from 'consts';

const ActionContainer = styled.div`
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  @media (max-width: 1150px) {
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

export const SendMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [method, setMethod] = useState('provenance_sendTransaction');
  const [gasData, setGasData] = useState({ gasPrice: '', gasPriceDenom: '' });
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const sendMessageLoading = loading === 'sendMessage';
  // Create all event listeners for this method
  useEffect(() => {
    const completeEvent = (result: any) => {
      setResults({
        action: 'sendMessage',
        status: 'success',
        message: `WalletConnectJS | sendMessage Complete`,
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
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
      wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);
    }
    return () => {
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);
    };
  }, [wcs, setResults, initialLoad]);

  const handleSubmit = () => {
    // Convert input string value to number for price
    const finalGasData = { ...gasData, gasPrice: Number(gasData.gasPrice) };
    wcs.sendMessage(message, description, finalGasData, method);
  };

  return (
    <ActionCard icon={ICON_NAMES.GEAR} title="Send Message" status={results?.status}>
      Pass along an encoded base64 message to the wallet
      <ActionContainer>
        <>
          <Input
            width="100%"
            value={message}
            label="Base64 Encoded Message"
            placeholder="Enter Base64 Encoded Message"
            onChange={setMessage}
            bottomGap
          />
          <Input
            value={method}
            label="Message method"
            placeholder="Enter the message method"
            onChange={setMethod}
            bottomGap
          />
          <Input
            value={description}
            label="Wallet message description (Optional)"
            placeholder="Enter message description"
            onChange={setDescription}
            bottomGap
          />
          <ActionGas setGasData={setGasData} gasData={gasData} />
          <Button
            loading={sendMessageLoading}
            onClick={handleSubmit}
            disabled={!message || !method}
          >
            Submit
          </Button>
        </>
      </ActionContainer>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
