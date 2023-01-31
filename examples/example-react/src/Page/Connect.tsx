import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES,
  BroadcastResult,
} from '@provenanceio/walletconnect-js';
import { Button, Card, Dropdown, Input, Results, Checkbox } from 'Components';
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
  const [address, setAddress] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [groupsAllowed, setGroupsAllowed] = useState(true);
  const [results, setResults] = useState<{
    [key: string]: any;
  } | null>(null);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { status } = walletConnectState;
  const navigate = useNavigate();

  // Listen for a connection, then redirect to action page
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);

      const handleConnectedEvent = (results: BroadcastResult) => {
        setResults(results);
      };
      wcs.addListener(WINDOW_MESSAGES.CONNECTED, handleConnectedEvent);
    }
  }, [wcs, navigate, initialLoad]);

  if (status === 'connected')
    return (
      <Card
        title="Connection Successful"
        logoIcon={ICON_NAMES.CHECK}
        bannerName="figureBuildings"
        logoBg={COLORS.NOTICE_400}
      >
        Select additional wallet actions from the sidebar menu
        <Results results={results} setResults={setResults} />
      </Card>
    );
  if (status === 'disconnected')
    return (
      <Card title="Connect your Wallet" logoIcon={ICON_NAMES.WALLETCONNECT}>
        <Text>Select a bridge and connect your wallet.</Text>
        <Dropdown
          options={BRIDGE_URLS}
          onChange={setSelectedBridge}
          value={selectedBridge}
          label="Select Bridge"
          bottomGap
        />
        <Input
          onChange={setAddress}
          value={address}
          label="Enter wallet address to connect with (optional)"
          placeholder="Enter wallet address (optional)"
          bottomGap
        />
        <Checkbox
          label="Group Accounts Allowed"
          checked={groupsAllowed}
          onChange={setGroupsAllowed}
        />
        <Button
          onClick={() =>
            wcs.connect({
              bridge: selectedBridge,
              duration: 3600,
              address,
              prohibitGroups: !groupsAllowed,
            })
          }
        >
          Connect
        </Button>
        <QRCodeModalStyled
          walletConnectService={wcs}
          devWallets={['figure_web_test', 'figure_mobile_test']}
        />
      </Card>
    );
  return (
    <Card
      title="Connection Pending"
      logoIcon={ICON_NAMES.WALLETCONNECT}
      logoBg={COLORS.SECONDARY_500}
    >
      Connection is currently pending.
      <QRCodeModalStyled
        walletConnectService={wcs}
        devWallets={['figure_web_test', 'figure_mobile_test']}
      />
    </Card>
  );
};
