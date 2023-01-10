import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES,
  BroadcastResults,
} from '@provenanceio/walletconnect-js';
import { Button, Card, Dropdown, Results } from 'Components';
import { ICON_NAMES, BRIDGE_URLS } from 'consts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS, FONTS } from 'theme';

const Text = styled.p`
  margin-bottom: 30px;
`;
const QRCodeModalStyled = styled(QRCodeModal)`
  background: ${COLORS.BLACK_70};
  font-family: ${FONTS.SECONDARY_FONT};
`;

export const Connect: React.FC = () => {
  const [selectedBridge, setSelectedBridge] = useState(BRIDGE_URLS[0]);
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>(null);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { connected } = walletConnectState;
  const navigate = useNavigate();

  // Listen for a connection, then redirect to action page
  useEffect(() => {
    const handleConnectedEvent = (results: BroadcastResults) => {
      setResults(results);
    };
    wcs.addListener(WINDOW_MESSAGES.CONNECTED, handleConnectedEvent);
    return () => {
      wcs.removeListener(WINDOW_MESSAGES.CONNECTED, handleConnectedEvent);
      setResults({});
    };
  }, [wcs, navigate]);

  return connected ? (
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
    <Card title="Connect your Wallet" logoIcon={ICON_NAMES.WALLETCONNECT}>
      <Text>Select a bridge and connect your wallet.</Text>
      <Dropdown
        options={BRIDGE_URLS}
        onChange={setSelectedBridge}
        value={selectedBridge}
        label="Select Bridge"
        bottomGap
      />
      <Button
        onClick={() => wcs.connect({ bridge: selectedBridge, duration: 3600 })}
      >
        Connect
      </Button>
      <QRCodeModalStyled
        walletConnectService={wcs}
        devWallets={['figure_web_test', 'figure_mobile_test']}
      />
    </Card>
  );
};
