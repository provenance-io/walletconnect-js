import WalletConnectClient from '@walletconnect/client';
import { Button, Card, Input, Results } from 'Components';
import { ICON_NAMES } from 'consts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from 'theme';

const Text = styled.p`
  margin-bottom: 30px;
`;

export const FigureDAppConnect: React.FC = () => {
  const [wcUriParam, setWcUriParam] = useState('');
  const [walletSessionStatus, setWalletSessionStatus] = useState<any>({
    chainId: 'pio-testnet-1',
    accounts: [
      {
        publicKey: 'A3PJr+3B7o61zqfKj/mZuV7cc5JbsWE4iVZU97XMd8v2',
        address: 'tp1zz0c8j07atff5y4kk59lgwg4es7d6y35jfg2xm',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJBM1BKciszQjdvNjF6cWZLai9tWnVWN2NjNUpic1dFNGlWWlU5N1hNZDh2MiIsImlzcyI6InByb3ZlbmFuY2UuaW8iLCJpYXQiOjE2NzExMzQ2MjEsImV4cCI6MTY3MTIyMTAyMSwiYWRkciI6InRwMXp6MGM4ajA3YXRmZjV5NGtrNTlsZ3dnNGVzN2Q2eTM1amZnMnhtIn0.Jc3IuEpCozMh2mCeh4Ez-7uLqUICUnSeihKSP-lgLQUqc7XGMDiPhekLD-eV_uPt4OxsgZb4ea7vYVT29zDLPA',
        walletInfo: {
          name: 'my super wallet',
        },
      },
    ],
  });
  const [connector, setConnector] = useState<WalletConnectClient | undefined>(
    undefined
  );
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>(null);
  const [isFigureWalletConnected, setFigureWalletConnected] = useState(false);
  const [error, setError] = useState('');

  return isFigureWalletConnected ? (
    <Card
      title="Connection Successful"
      logoIcon={ICON_NAMES.CHECK}
      bannerName="figureBuildings"
      logoBg={COLORS.NOTICE_400}
    >
      Select additional wallet actions from the sidebar menu
      <Results results={results} setResults={setResults} />
    </Card>
  ) : (
    <Card
      title="Figure Wallet - Wallet Connect integration for Figure DApps"
      logoIcon={ICON_NAMES.WALLETCONNECT}
    >
      {connector ? (
        <>
          <Text>Connection Request Pending with {connector.peerMeta?.name}</Text>
          Connector :{JSON.stringify(connector)}
          <Button
            onClick={() => {
              try {
                connector.approveSession(walletSessionStatus);
                setFigureWalletConnected(true);
              } catch (e) {
                setError((e as Error).message || 'Something unexpected happened');
              }
            }}
          >
            Approve Session
          </Button>
        </>
      ) : (
        <>
          <Text>Enter WC param from the Figure DApp</Text>
          <Input
            value={wcUriParam}
            label="WC Param"
            onChange={setWcUriParam}
            bottomGap
          />
          <Text>Enter Figure Wallet Data as JSON</Text>
          <Input
            value={JSON.stringify(walletSessionStatus)}
            label="Wallet Session status (ISessionStatus)"
            onChange={setWalletSessionStatus}
            bottomGap
          />
          <Button
            onClick={async () => {
              const connector = await new WalletConnectClient({
                uri: decodeURIComponent(wcUriParam),
              });
              setConnector(connector);
            }}
          >
            Connect
          </Button>
        </>
      )}
    </Card>
  );
};
