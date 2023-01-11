import { useState, useEffect } from 'react';
import {
  useWalletConnect,
  WINDOW_MESSAGES,
  BroadcastResult,
} from '@provenanceio/walletconnect-js';
import { Button, Input, ActionCard, Results } from 'Components';
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
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signJWTLoading = loading === 'signJWT';

  const newExpirationDate = new Date(
    Date.now() + Number(value) * 1000
  ).toLocaleString('en-US');

  const handleSubmit = () => {
    wcs.signJWT(Number(value));
  };

  // Create all event listeners for this Action Card method
  useEffect(() => {
    const completeEvent = (data: BroadcastResult) => {
      setResults({
        action: 'signJWT',
        status: 'success',
        message: 'WalletConnectJS | Sign JWT Complete',
        data,
      });
    };
    const failEvent = (data: BroadcastResult) => {
      const { error } = data;
      const message = error || 'Unknown error';
      setResults({
        action: 'signJWT',
        status: 'failed',
        message,
        data,
      });
    };
    // First load, if windowMessages passed in, create events
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, completeEvent);
      wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, failEvent);
    }
  }, [initialLoad, wcs]);

  return (
    <ActionCard
      icon={ICON_NAMES.PENCIL}
      title="Sign JWT"
      description="Sign a new JWT, updated any existing value"
      status={results?.status}
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
      <Results results={results} setResults={setResults} />
    </ActionCard>
  );
};
