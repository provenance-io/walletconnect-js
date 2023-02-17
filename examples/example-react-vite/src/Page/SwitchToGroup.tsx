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
  const { pendingMethod, representedGroupPolicy } = walletConnectState;
  const switchToGroupLoading = pendingMethod === 'switchToGroup';

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
      description="Switch the connected account to (un)represent a group."
      status={results?.status}
    >
      <Input
          width="100%"
          value={groupPolicyAddress}
          label="Group Policy Address (Leave Blank to Unset Group)"
          placeholder="Enter group policy address"
          onChange={setGroupPolicyAddress}
          bottomGap
          disabled={switchToGroupLoading}
      />
      <Input
          value={description}
          label="Description (Optional)"
          placeholder="Enter description (optional)"
          onChange={setDescription}
          bottomGap
          disabled={switchToGroupLoading}
      />

      <Button
        loading={switchToGroupLoading}
        onClick={handleSubmit}
        disabled={ !groupPolicyAddress && !representedGroupPolicy }
      >
        Submit
      </Button>
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
