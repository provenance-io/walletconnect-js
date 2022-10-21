import { useEffect, useState } from 'react';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import type { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { Card } from '../Card';
import { Results } from '../Results';

const ActionContainer = styled.div`
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  @media (max-width: 1150px) {
    justify-content: flex-start;
    input {
      margin-bottom: 10px;
    }
  }
`;

type WindowMessageKeys = keyof typeof WINDOW_MESSAGES;
type WindowMessageValues = typeof WINDOW_MESSAGES[WindowMessageKeys];

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
  description?: string;
  windowMessages?: {
    success: WindowMessageValues;
    failure: WindowMessageValues;
  };
}

export const ActionCard: React.FC<Props> = ({
  title,
  icon,
  children,
  description = 'n/a',
  windowMessages,
}) => {
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>({});
  const [initialLoad, setInitialLoad] = useState(true);

  const { walletConnectService: wcs } = useWalletConnect();

  // Create all event listeners for this Action Card method
  useEffect(() => {
    const completeEvent = (result: any) => {
      console.log('completeEvent triggered: ', result);
      setResults({
        action: title,
        status: 'success',
        message: `WalletConnectJS | ${title} Complete`,
        data: result,
      });
    };
    const failEvent = (result: any) => {
      const { error } = result;
      setResults({
        action: title,
        status: 'failed',
        message: error.message,
        data: result,
      });
    };
    // First load, if windowMessages passed in, create events
    if (initialLoad && windowMessages) {
      setInitialLoad(false);
      wcs.addListener(windowMessages.success, completeEvent);
      wcs.addListener(windowMessages.failure, failEvent);
    }
    return () => {
      if (windowMessages) {
        wcs.removeListener(windowMessages.success, completeEvent);
        wcs.removeListener(windowMessages.failure, failEvent);
      }
    };
  }, [initialLoad, wcs, windowMessages, title]);

  return (
    <Card
      title={`${title} ${results?.status ? `(${results?.status})` : ''}`}
      logoIcon={icon}
      logoBg={`${
        results?.status
          ? results?.status === 'success'
            ? COLORS.NOTICE_400
            : COLORS.NEGATIVE_400
          : COLORS.SVG_DEFAULT
      }`}
      bannerName={`${
        results?.status
          ? results?.status === 'success'
            ? 'figureBuildings'
            : 'figureGrey'
          : 'figureChain'
      }`}
    >
      {description}
      <ActionContainer>{children}</ActionContainer>
      <Results results={results} setResults={setResults} />
    </Card>
  );
};
