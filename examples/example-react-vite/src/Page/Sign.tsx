import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { ActionCard, Button, Checkbox, Input, Results } from 'Components';
import { ICON_NAMES } from 'consts';
import { useState } from 'react';

export const Sign: React.FC = () => {
  const [value, setValue] = useState('');
  const [customId, setCustomId] = useState('');
  const [description, setDescription] = useState('');
  const [isHex, setIsHex] = useState(false);
  const [results, setResults] = useState<any>();
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState.connection;
  const signMessageLoading = pendingMethod === 'sign';

  const handleSubmit = async () => {
    const result = await wcs.signMessage(value, {customId, description, isHex});
    setResults(result);
  };

  const status = results ? results.error ? 'failure' : 'success' : undefined;

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign Message"
      description="The message to be signed may be hex encoded (signing bytes).
                   If hex, the wallet will decode the hex message and sign the underlying bytes."
      status={status}
    >
      <Checkbox onChange={setIsHex} checked={isHex} label='Message is already hex encoded' disabled={signMessageLoading} />
      <Input
        value={value}
        label="Message"
        placeholder="Enter message"
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
      <Input
          value={description}
          label="Description (Optional)"
          placeholder="Enter a description for the wallet to display to users when signing"
          onChange={setDescription}
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
