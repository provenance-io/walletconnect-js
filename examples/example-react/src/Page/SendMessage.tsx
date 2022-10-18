import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, Card, Results } from 'Components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

const ActionContainer = styled.div`
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: 'nowrap';
  @media (max-width: 1150px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

export const SendMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState('provenance_sendTransaction');
  const [gasFee, setGasFee] = useState(0);
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
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);

    return () => {
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, completeEvent);
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, failEvent);
    };
  }, [wcs, setResults]);

  const handleSubmit = () => {
    wcs.sendMessage(message, description, gasFee, method);
  };

  return (
    <Card
      title={`Send Message ${results?.status ? `(${results.status})` : ''}`}
      logoIcon={ICON_NAMES.GEAR}
      logoBg={`${
        results?.status
          ? results.status === 'success'
            ? COLORS.NOTICE_400
            : COLORS.NEGATIVE_400
          : COLORS.SVG_DEFAULT
      }`}
      bannerName={`${
        results?.status
          ? results.status === 'success'
            ? 'figureBuildings'
            : 'figureGrey'
          : 'figureChain'
      }`}
    >
      Pass along an encoded base64 message to the wallet
      <ActionContainer>
        {
          // {
          //   gas: true,
          //   fields: [
          //     {
          //       name: 'message',
          //       label: 'Base64 Encoded Message',
          //       value: '',
          //       placeholder: 'Enter Base64 Encoded Message',
          //     },
          //     {
          //       name: 'method',
          //       label: 'Message method',
          //       value: 'provenance_sendTransaction',
          //       placeholder: 'Enter the message method',
          //     },
          //     {
          //       name: 'description',
          //       label: 'Wallet message description (Optional)',
          //       value: '',
          //       placeholder: 'Enter message description',
          //     },
          //   ],
          // },
        }
        <Input
          value={value}
          label="Custom JWT Expiration"
          placeholder="Enter custom expiration (seconds from now)"
          onChange={setValue}
        />
        <Button
          loading={sendMessageLoading}
          onClick={handleSubmit}
          disabled={!value}
        >
          Submit
        </Button>
      </ActionContainer>
      <Results results={results} setResults={setResults} />
    </Card>
  );
};
