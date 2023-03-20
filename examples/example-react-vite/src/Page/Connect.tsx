import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES,
} from '@provenanceio/walletconnect-js';
import type { BroadcastResult } from '@provenanceio/walletconnect-js';
import { Button, Card, Dropdown, Input, Results, Checkbox } from 'Components';
import { ICON_NAMES, BRIDGE_URLS } from 'consts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS, FONTS } from 'theme';

const AdvancedOptionsToggle = styled.p<{ showAdvanced: boolean }>`
  margin-bottom: 30px;
  user-select: none;
  cursor: pointer;
  color: ${({ showAdvanced }) =>
    showAdvanced ? COLORS.PRIMARY_300 : COLORS.PRIMARY_500};
  font-weight: bold;
  font-style: italic;
  font-size: 1.2rem;
`;
const AdvancedOptions = styled.div`
  border: 1px solid ${COLORS.NEUTRAL_250};
  background: ${COLORS.NEUTRAL_100};
  padding: 20px 30px;
  border-radius: 4px;
  margin-bottom: 20px;
`;
const DirectConnectButton = styled(Button)`
  background: ${COLORS.SECONDARY_450};
  margin-top: 20px;
  &:hover:not(:disabled) {
    background-color: ${COLORS.SECONDARY_350};
  }
`;
const QRCodeModalStyled = styled(QRCodeModal)`
  background: ${COLORS.BLACK_70};
  font-family: ${FONTS.SECONDARY_FONT};
`;

export const Connect: React.FC = () => {
  const [directQRCodeGenerate, setDirectQRCodeGenerate] = useState(false);
  const [selectedBridge, setSelectedBridge] = useState(BRIDGE_URLS[0]);
  const [individualAddress, setIndividualAddress] = useState('');
  const [groupAddress, setGroupAddress] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [groupsAllowed, setGroupsAllowed] = useState(true);
  const [jwtExpiration, setJwtExpiration] = useState('');
  const [sessionDuration, setSessionDuration] = useState('3600');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState<{
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  } | null>(null);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { status, modal } = walletConnectState;
  const { QRCodeImg, dynamicUrl } = modal;
  const navigate = useNavigate();

  // Listen for a connection, then redirect to action page
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);

      const handleConnectedEvent = (connectResults: BroadcastResult) => {
        setResults({
          data: { ...walletConnectState, broadcastResult: connectResults },
        });
      };
      wcs.addListener(WINDOW_MESSAGES.CONNECTED, handleConnectedEvent);
      wcs.addListener(WINDOW_MESSAGES.DISCONNECT, handleConnectedEvent);
    }
  }, [wcs, navigate, initialLoad, walletConnectState]);

  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced);
  };

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
        <AdvancedOptionsToggle
          showAdvanced={showAdvanced}
          onClick={toggleAdvancedOptions}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </AdvancedOptionsToggle>
        {showAdvanced && (
          <AdvancedOptions>
            <Dropdown
              options={BRIDGE_URLS}
              onChange={setSelectedBridge}
              value={selectedBridge}
              label="Select Bridge"
              bottomGap
            />
            <Input
              onChange={setIndividualAddress}
              value={individualAddress}
              label="Enter individual account address to connect with (optional)"
              placeholder="Enter individual account address (optional)"
              bottomGap
            />
            <Input
              onChange={setGroupAddress}
              value={groupAddress}
              label="Enter group account address to connect with (optional)"
              placeholder="Enter group account address (optional)"
              bottomGap
            />
            <Input
              onChange={setJwtExpiration}
              value={jwtExpiration}
              label="Custom JWT Expiration in seconds (optional)"
              placeholder="Use default (24 hours)"
              bottomGap
            />
            <Input
              onChange={setSessionDuration}
              value={sessionDuration}
              label="Custom session duration in seconds (optional)"
              placeholder="Use default (3600 seconds/1 hour)"
              bottomGap
            />
            <Checkbox
              label="Group Accounts Allowed"
              checked={groupsAllowed}
              onChange={setGroupsAllowed}
            />
          </AdvancedOptions>
        )}
        <Button
          onClick={() =>
            wcs.connect({
              bridge: selectedBridge,
              duration: Number(sessionDuration),
              individualAddress,
              groupAddress,
              prohibitGroups: !groupsAllowed,
              jwtExpiration: Number(jwtExpiration),
            })
          }
        >
          Connect with QRCodeModal
        </Button>
        <DirectConnectButton
          onClick={() =>
            wcs.connect({
              bridge: selectedBridge,
              duration: Number(sessionDuration),
              individualAddress,
              groupAddress,
              prohibitGroups: !groupsAllowed,
              jwtExpiration: Number(jwtExpiration),
              walletAppId: 'figure_extension',
            })
          }
        >
          Connect directly with Figure Extension Wallet
        </DirectConnectButton>
        <DirectConnectButton
          onClick={() =>
            wcs.connect({
              bridge: selectedBridge,
              duration: Number(sessionDuration),
              individualAddress,
              groupAddress,
              prohibitGroups: !groupsAllowed,
              jwtExpiration: Number(jwtExpiration),
              walletAppId: 'figure_hosted_test',
            })
          }
        >
          Connect directly with Figure Hosted Wallet
        </DirectConnectButton>
        <DirectConnectButton
          onClick={() => {
            setDirectQRCodeGenerate(true);
            wcs.connect({
              bridge: selectedBridge,
              duration: Number(sessionDuration),
              individualAddress,
              groupAddress,
              prohibitGroups: !groupsAllowed,
              jwtExpiration: Number(jwtExpiration),
              walletAppId: 'figure_mobile_test',
            });
          }}
        >
          Connect directly with Figure Mobile
        </DirectConnectButton>
        {directQRCodeGenerate && QRCodeImg && <img src={QRCodeImg} />}
        {directQRCodeGenerate && dynamicUrl && (
          <div>
            <a href={dynamicUrl}>Dynamic Url</a>
          </div>
        )}
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
