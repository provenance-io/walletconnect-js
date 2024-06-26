import type { BroadcastEventData, QrOptions, WalletId } from '@provenanceio/walletconnect-js';
import {
  QRCodeModal,
  WALLET_LIST,
  WINDOW_MESSAGES,
  useWalletConnect,
} from '@provenanceio/walletconnect-js';
import { Button, Card, Checkbox, Dropdown, Input, Results } from 'Components';
import { BRIDGE_URLS, ICON_NAMES } from 'consts';
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
const QRCodeImage = styled.img`
  height: 200px;
  width: 200px;
`;
const QRSection = styled.div`
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: bold;
`;

export const Connect: React.FC = () => {
  const [directQRCodeGenerate, setDirectQRCodeGenerate] = useState(false);
  const defaultSelectedBridge =
    window.location.href.includes('test.figure.com') ||
    window.location.href.includes('localhost')
      ? BRIDGE_URLS[1]
      : BRIDGE_URLS[0];
  const [selectedBridge, setSelectedBridge] = useState(defaultSelectedBridge);
  const [customBridge, setCustomBridge] = useState('');
  const [individualAddress, setIndividualAddress] = useState('');
  const [groupAddress, setGroupAddress] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [groupsAllowed, setGroupsAllowed] = useState(true);
  const [jwtExpiration, setJwtExpiration] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Custom QR
  const [qrBackgroundColor, setQrBackgroundColor] = useState('#ffffff');
  const [qrForegroundColor, setQrForegroundColor] = useState('#000000');
  const [qrLogoColor, setQrLogoColor] = useState('#000000');
  const [qrShowLogo, setQrShowLogo] = useState(true);
  const [qrPadding, setQrPadding] = useState('0');

  const [results, setResults] = useState<BroadcastEventData[keyof BroadcastEventData] | undefined>();
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { status, modal } = walletConnectState;
  const { QRCodeImg, dynamicUrl } = modal;

  const navigate = useNavigate();

  // Listen for a connection, then redirect to action page
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      wcs.addListener(WINDOW_MESSAGES.CONNECTED, (eventResults) => {
        setResults(eventResults)});
      wcs.addListener(WINDOW_MESSAGES.DISCONNECT, (eventResults) => {
        setResults(eventResults)
      });
    }
  }, [wcs, navigate, initialLoad, walletConnectState]);

  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleConnect = async (walletAppId?: WalletId, mobileDirect?: boolean) => {
    // Check to see if the wallet exists
    if (walletAppId) {
      // If we find the target walletAppId in the walletList
      const targetWallet = WALLET_LIST.find(({id}) => walletAppId === id);
      if (targetWallet && targetWallet.walletCheck) {
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
    const qrOptions: QrOptions = {
      backgroundColor: qrBackgroundColor,
      foregroundColor: qrForegroundColor,
      logoColor: qrLogoColor,
      padding: qrPadding ? Number(qrPadding) : undefined,
      showLogo: qrShowLogo
    };
    await wcs.init({
      // Use custom if given, or if left blank but custom selected, use the first in the options array
      bridge: finalBridge,
      duration: Number(sessionDuration),
      groupAddress,
      iframeParentId: 'portal',
      individualAddress,
      jwtExpiration: Number(jwtExpiration),
      prohibitGroups: !groupsAllowed,
      qrOptions,
      walletAppId,
    })
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
              placeholder="Use default (24 hours)"
              bottomGap
            />
            <Checkbox
              label="Group Accounts Allowed"
              checked={groupsAllowed}
              onChange={setGroupsAllowed}
            />
            <QRSection>Customize QR Code</QRSection>
            <Checkbox
              label="Show Figure Logo"
              checked={qrShowLogo}
              onChange={setQrShowLogo}
            />
            <Input
              onChange={setQrLogoColor}
              value={qrLogoColor}
              label="Figure Logo Color"
              placeholder="Enter custom logo color"
              bottomGap
            />
            <Input
              onChange={setQrBackgroundColor}
              value={qrBackgroundColor}
              label="QR Background Color"
              placeholder="Enter custom QR background color"
              bottomGap
            />
            <Input
              onChange={setQrForegroundColor}
              value={qrForegroundColor}
              label="QR Foreground Color"
              placeholder="Enter custom QR foreground color"
              bottomGap
            />
            <Input
              onChange={setQrPadding}
              value={qrPadding}
              label="QR Image Padding"
              placeholder="Enter custom QR image padding"
              bottomGap
            />
          </AdvancedOptions>
        )}
        {showQRCode && !!walletConnectState.modal.QRCodeImg && <div><QRCodeImage src={walletConnectState.modal.QRCodeImg} /></div>}
        <Button onClick={handleConnect}>
          Connect with Prebuilt Modal
        </Button>
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
