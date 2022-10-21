import { useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';

const NewExpirationDate = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  width: 100%;
  font-style: italic;
  color: ${COLORS.NEUTRAL_350};
`;

export const SignJWT: React.FC = () => {
  const [value, setValue] = useState('');
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signJWTLoading = loading === 'signJWT';

  const newExpirationDate = new Date(
    Date.now() + Number(value) * 1000
  ).toLocaleString('en-US');

  const handleSubmit = () => {
    wcs.signJWT(Number(value));
  };

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign JWT"
      description="Sign a new JWT, updated any existing value"
      windowMessages={{
        success: WINDOW_MESSAGES.SIGN_JWT_COMPLETE,
        failure: WINDOW_MESSAGES.SIGN_JWT_FAILED,
      }}
    >
      <Input
        value={value}
        label="Custom JWT Expiration"
        placeholder="Enter custom expiration (seconds from now)"
        onChange={setValue}
        disabled={signJWTLoading}
        bottomGap
        submit={handleSubmit}
      />
      {value && <NewExpirationDate>{`${newExpirationDate}`}</NewExpirationDate>}
      <Button loading={signJWTLoading} onClick={handleSubmit} disabled={!value}>
        Submit
      </Button>
    </ActionCard>
  );
};
