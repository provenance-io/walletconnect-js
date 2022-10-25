import { useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';

const ExpiresText = styled.div`
  margin-bottom: 20px;
  font-size: 1.2rem;
  padding: 6px 10px;
  background: ${COLORS.PRIMARY_150};
  color: ${COLORS.PRIMARY_600};
  border-radius: 10px;
`;

export const ResetConnectionTimeout: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { connectionEXP } = walletConnectState;

  const handleSubmit = () => {
    setLoading(true);
    // Artificial 1s delay to prevent spamming submit (not an async request)
    window.setTimeout(() => {
      wcs.resetConnectionTimeout(value ? Number(value) : undefined);
      setLoading(false);
    }, 1000);
  };

  const currentExpiration = connectionEXP
    ? new Date(connectionEXP).toLocaleDateString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  return (
    <ActionCard
      icon={ICON_NAMES.RELOAD}
      title="Reset Connection Timeout"
      description="Set a new connection timeout x seconds in the future"
    >
      <ExpiresText>Current connection expires {currentExpiration}</ExpiresText>
      <Input
        value={value}
        label="Bump connection by seconds"
        placeholder="(optional) Enter seconds"
        onChange={setValue}
        bottomGap
        disabled={loading}
        submit={handleSubmit}
      />
      <Button loading={loading} onClick={handleSubmit}>
        Submit
      </Button>
    </ActionCard>
  );
};
