import { useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard } from 'Components';
import { ICON_NAMES } from 'consts';

export const SignJWT: React.FC = () => {
  const [value, setValue] = useState('');
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signJWTLoading = loading === 'signJWT';

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
        bottomGap
      />
      <Button loading={signJWTLoading} onClick={handleSubmit} disabled={!value}>
        Submit
      </Button>
    </ActionCard>
  );
};
