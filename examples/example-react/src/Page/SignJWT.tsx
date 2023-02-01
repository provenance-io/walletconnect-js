import { useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
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
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { pendingMethod } = walletConnectState;
  const signJWTLoading = pendingMethod === 'signJWT';

  const newExpirationDate = new Date(
    Date.now() + Number(value) * 1000
  ).toLocaleString('en-US');

  const handleSubmit = async () => {
    const result = await wcs.signJWT(Number(value));
    console.log(
      'example-react | SignJWT.tsx | handleSubmit | signJWT result: ',
      result
    );
    setResults({
      action: 'signJWT',
      status: result.error ? 'failed' : 'success',
      message: result.error ? result.error : 'WalletConnectJS | Sign JWT Complete',
      data: result,
    });
  };

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
