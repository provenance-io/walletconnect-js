import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { Card } from 'Components';
import { ICON_NAMES } from 'consts';
import { useEffect } from 'react';
import { COLORS } from 'theme';

export const DApp: React.FC = () => {
  const { walletConnectState } = useWalletConnect();
  const { status } = walletConnectState;
  const FIGURE_CONNECT_URL = 'https://test.figure.com/figure-wallet/connect';

  useEffect(() => {
    if (status === 'disconnected') {
      setTimeout(() => {
        window.location.href = `${FIGURE_CONNECT_URL}?redirectUrl=${window.location.href}`;
      }, 2000);
    }
  }, [status]);

  return (
    <Card
      title="dApp Page"
      logoIcon={ICON_NAMES.WALLETCONNECT}
      logoBg={COLORS.SECONDARY_500}
    >
      Connection status: <b>{status}</b>
      {status === 'disconnected' && (
        <div>You are disconnected, redirecting to the Figure Connect page in 3s</div>
      )}
    </Card>
  );
};
