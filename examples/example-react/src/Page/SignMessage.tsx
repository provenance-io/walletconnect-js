import { useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard } from 'Components';
import { ICON_NAMES } from 'consts';

export const SignMessage: React.FC = () => {
  const [value, setValue] = useState('');
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signMessageLoading = loading === 'signMessage';

  const handleSubmit = () => {
    wcs.signMessage(value);
  };

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign Message"
      description="Send a sign request message to the wallet"
      windowMessages={{
        success: WINDOW_MESSAGES.SIGNATURE_COMPLETE,
        failure: WINDOW_MESSAGES.SIGNATURE_FAILED,
      }}
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
    </ActionCard>
  );
};
