import { useState, useEffect } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
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
    const completeEvent = (result: any) => {
      setResults({
        action: 'signMessage',
        status: 'success',
        message: 'WalletConnectJS | Sign Message Complete',
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: 'signMessage',
        status: 'failed',
        message: error.message,
        data: result,
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
      description="Send a sign request message to the wallet"
      status={results?.status}
    >
      <Input
        value={value}
        label="Message"
        placeholder="Enter message"
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
