import { useState, useEffect } from 'react';
import {
  useWalletConnect,
  WINDOW_MESSAGES,
  BroadcastResult,
} from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const SignMessage: React.FC = () => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signMessageLoading = loading === 'signMessage';

  // Create all event listeners for this Action Card method
  useEffect(() => {
    const completeEvent = (data: BroadcastResult) => {
      setResults({
        action: 'signMessage',
        status: 'success',
        message: 'WalletConnectJS | Sign Message Complete',
        data,
      });
    };
    const failEvent = (data: BroadcastResult) => {
      const { error } = data;
      const message = error || 'Unknown error';
      setResults({
        action: 'signMessage',
        status: 'failed',
        message,
        data,
      });
    };
    // First load, if windowMessages passed in, create events
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.SIGN_MESSAGE_COMPLETE, completeEvent);
      wcs.addListener(WINDOW_MESSAGES.SIGN_MESSAGE_FAILED, failEvent);
    }
  }, [initialLoad, wcs]);

  const handleSubmit = () => {
    wcs.signMessage(value);
  };

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign Message"
      description="Send a sign message request message to the wallet.
                   The message to be signed must be hex encoded to allow for signing of bytes.
                   The wallet will decode the hex message and sign the underlying bytes."
      status={results?.status}
    >
      <Input
        value={value}
        label="Hex Encoded Message"
        placeholder="Enter hex encoded message"
        onChange={setValue}
        bottomGap
        disabled={signMessageLoading}
        submit={handleSubmit}
      />
      <Button loading={signMessageLoading} onClick={handleSubmit} disabled={!value}>
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
