import { useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import type { BroadcastEventData } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const RemovePendingMethod: React.FC = () => {
  const [customId, setCustomId] = useState('');
  const [results, setResults] = useState<BroadcastEventData[keyof BroadcastEventData] | undefined>();

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const loading = pendingMethod === 'removePendingMethod';

  const handleSubmit = async () => {
    const result = await wcs.removePendingMethod(customId);
    setResults(result);
  };

  const status = results ? results.error ? 'failure' : 'success' : undefined;

  return (
    <ActionCard
      icon={ICON_NAMES.TAG}
      title="Pending Action"
      description="Recall or reject a pending action from the wallet."
      status={status}
    >
      <Input
          width="100%"
          value={customId}
          label="Pending Method ID"
          placeholder="Enter the ID"
          onChange={setCustomId}
          bottomGap
          disabled={loading}
      />
      <Button
        loading={loading}
        onClick={handleSubmit}
        disabled={ !customId }
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
