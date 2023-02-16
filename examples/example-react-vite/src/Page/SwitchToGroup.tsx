import { useState } from 'react';
import { useWalletConnect, ProvenanceMethod } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
import { ICON_NAMES } from 'consts';

export const SwitchToGroup: React.FC = () => {
  const [groupPolicyAddress, setGroupPolicyAddress] = useState('');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const sendMessageLoading = pendingMethod === 'sendWalletAction';

  const handleSubmit = async () => {

    const result = await wcs.switchToGroup(groupPolicyAddress, description);
    setResults({
      action: 'switchToGroup',
      status: result.error ? 'failed' : 'success',
      message: result.error
        ? result.error
        : 'WalletConnectJS | Switch To Group Complete',
      data: result,
    });
  };

  return (
    <ActionCard
      icon={ICON_NAMES.GEAR}
      title="Switch to Group"
      description="Switch the connected account to a group account"
      status={results?.status}
    >
      <Input
          width="100%"
          value={groupPolicyAddress}
          label="Group Policy Address"
          placeholder="Enter group policy address"
          onChange={setGroupPolicyAddress}
          bottomGap
          disabled={sendMessageLoading}
      />
      <Input
          value={description}
          label="Description (Optional)"
          placeholder="Enter description (optional)"
          onChange={setDescription}
          bottomGap
          disabled={sendMessageLoading}
      />

      <Button
        loading={sendMessageLoading}
        onClick={handleSubmit}
        disabled={ !groupPolicyAddress }
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
