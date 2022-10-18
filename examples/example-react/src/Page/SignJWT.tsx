import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import { Button, Input, Card, Results } from 'Components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

const ActionContainer = styled.div`
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: 'nowrap';
  @media (max-width: 1150px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

export const SignJWT: React.FC = () => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { loading } = walletConnectState;
  const signJWTLoading = loading === 'signJWT';
  // Create all event listeners for this method
  useEffect(() => {
    const completeEvent = (result: any) => {
      setResults({
        action: 'signJWT',
        status: 'success',
        message: `WalletConnectJS | signJWT Complete`,
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: 'signJWT',
        status: 'failed',
        message: error.message,
        data: result,
      });
    };
    wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, completeEvent);
    wcs.addListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, failEvent);

    return () => {
      wcs.removeListener(WINDOW_MESSAGES.SIGN_JWT_COMPLETE, completeEvent);
      wcs.removeListener(WINDOW_MESSAGES.SIGN_JWT_FAILED, failEvent);
    };
  }, [wcs, setResults]);

  const handleSubmit = () => {
    wcs.signJWT(Number(value));
  };

  return (
    <Card
      title={`Sign JWT ${results?.status ? `(${results.status})` : ''}`}
      logoIcon={ICON_NAMES.PENCIL}
      logoBg={`${
        results?.status
          ? results.status === 'success'
            ? COLORS.NOTICE_400
            : COLORS.NEGATIVE_400
          : COLORS.SVG_DEFAULT
      }`}
      bannerName={`${
        results?.status
          ? results.status === 'success'
            ? 'figureBuildings'
            : 'figureGrey'
          : 'figureChain'
      }`}
    >
      Sign a new JWT, updated any existing value
      <ActionContainer>
        <Input
          value={value}
          label="Custom JWT Expiration"
          placeholder="Enter custom expiration (seconds from now)"
          onChange={setValue}
        />
        <Button loading={signJWTLoading} onClick={handleSubmit} disabled={!value}>
          Submit
        </Button>
      </ActionContainer>
      <Results results={results} setResults={setResults} />
    </Card>
  );
};
