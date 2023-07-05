import { useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import type { BroadcastEventData } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const SignHexMessage: React.FC = () => {
  const [value, setValue] = useState('');
  const [customId, setCustomId] = useState('');
  const [results, setResults] = useState<BroadcastEventData[keyof BroadcastEventData] | undefined>();
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const signMessageLoading = pendingMethod === 'signHexMessage';

  const handleSubmit = async () => {
    const result = await wcs.signHexMessage(value, {customId});
    setResults(result);
  };

  const status = results ? results.error ? 'failure' : 'success' : undefined;

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign Hex Message"
      description="Send a sign message request message to the wallet.
                   The message to be signed must be hex encoded to allow for signing of bytes.
                   The wallet will decode the hex message and sign the underlying bytes."
      status={status}
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
      <Input
          value={customId}
          label="Custom ID (Optional)"
          placeholder="Enter Custom ID"
          onChange={setCustomId}
          bottomGap
          disabled={signMessageLoading}
      />
      <Button loading={signMessageLoading} onClick={handleSubmit} disabled={!value}>
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
