import type { WalletId } from '@provenanceio/walletconnect-js';
import {
  QRCodeModal,
  WALLET_LIST,
  useWalletConnect
} from '@provenanceio/walletconnect-js';
import { Button, Card, Checkbox, Dropdown, Input, Results } from 'Components';
import { BRIDGE_URLS, ICON_NAMES } from 'consts';
import { useState } from 'react';
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
  margin-top: 20px;
  &:hover:not(:disabled) {
    background-color: ${COLORS.SECONDARY_350};
  }
  &:nth-of-type(2) {
    background: ${COLORS.SECONDARY_450};
  }
  &:nth-of-type(3) {
    background: ${COLORS.SECONDARY_650};
  }
  &:nth-of-type(4) {
    background: ${COLORS.SECONDARY_750};
  }
`;
const QRCodeModalStyled = styled(QRCodeModal)`
  background: ${COLORS.BLACK_70};
  font-family: ${FONTS.SECONDARY_FONT};
`;

export const Connect: React.FC = () => {
  const [directQRCodeGenerate, setDirectQRCodeGenerate] = useState(false);
  const [selectedBridge, setSelectedBridge] = useState(BRIDGE_URLS[0]);
  const [customBridge, setCustomBridge] = useState('');
  const [individualAddress, setIndividualAddress] = useState('');
  const [groupAddress, setGroupAddress] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [groupsAllowed, setGroupsAllowed] = useState(true);
  const [jwtDuration, setJwtDuration] = useState('');
  const [connectionDuration, setConnectionDuration] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  // TODO: What is this type?  How will dApps know these types?
  // WCJS needs to export results for each method...
  const [results, setResults] = useState<any>();
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { status } = walletConnectState.connection;
  const { QRCodeImg, dynamicUrl } = walletConnectState.modal;
  const navigate = useNavigate();

  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleConnect = async (walletId: WalletId, mobileDirect?: boolean) => {
    // Check to see if the wallet exists
    if (walletId) {
      // If we find the target walletId in the walletList
      const targetWallet = WALLET_LIST.find(({id}) => walletId === id);
      if (targetWallet && targetWallet?.walletCheck) {
        // Check if the wallet exists for the user
        const walletExists = targetWallet.walletCheck();
        if (!walletExists) {
          alert('Wallet does not exist, after downloading and installing, please reload this page.')
        }
      }
    }
    
    // Clear out any existing results
    setResults(undefined);
    // Hide any existing QRCodes
    setShowQRCode(false);
    // Run connect method based on current state values
    const finalBridge = customBridge ? customBridge : selectedBridge !== 'custom' ? selectedBridge : BRIDGE_URLS[0];
    const results = await wcs.connect({
      // Use custom if given, or if left blank but custom selected, use the first in the options array
      bridge: finalBridge,
      ...(connectionDuration && {connectionDuration: Number(connectionDuration)}),
      ...(individualAddress && {individualAddress}),
      ...(groupAddress && {groupAddress}),
      ...(!groupsAllowed && {prohibitGroups: !groupsAllowed}),
      ...(jwtDuration && {jwtDuration: Number(jwtDuration)}),
      walletId,
      onDisconnect: (disconnectMessage) => { setResults({result: disconnectMessage}) },
    })
    setResults(results);
    // If connection with mobile directly, just show the QRCode
    if (mobileDirect) {
      setShowQRCode(true);
    }
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
            {selectedBridge === 'custom' && (
              <Input
                onChange={setCustomBridge}
                value={customBridge}
                label="Enter custom bridge url"
                placeholder="Custom bridge url"
                bottomGap
              />
            )}
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
              onChange={setJwtDuration}
              value={jwtDuration}
              label="Custom JWT Duration in seconds (optional)"
              placeholder="Use default (24 hours)"
              bottomGap
            />
            <Input
              onChange={setConnectionDuration}
              value={connectionDuration}
              label="Custom connection duration in seconds (optional)"
              placeholder="Use default (24 hours)"
              bottomGap
            />
            <Checkbox
              label="Group Accounts Allowed"
              checked={groupsAllowed}
              onChange={setGroupsAllowed}
            />
          </AdvancedOptions>
        )}
        {showQRCode && !!walletConnectState.modal.QRCodeImg && <div><img src={walletConnectState.modal.QRCodeImg} /></div>}
        <DirectConnectButton onClick={() => handleConnect('figure_extension')}>
          Connect directly with Figure Extension Wallet
        </DirectConnectButton>
        <DirectConnectButton onClick={() => handleConnect('figure_hosted_test')}>
          Connect directly with Figure Hosted Wallet
        </DirectConnectButton>
        <DirectConnectButton  onClick={() => handleConnect('figure_mobile_test', true)}>
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
          devWallets={['figure_hosted_test', 'figure_mobile_test']}
        />
        <Results results={results} setResults={setResults} />
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
        devWallets={['figure_hosted_test', 'figure_mobile_test']}
      />
    </Card>
  );
};
