import { useEffect } from 'react';
import { WINDOW_MESSAGES, useWalletConnect } from '@provenanceio/walletconnect-js';
import { Button } from 'Components';

interface Props {
  setResults: (results: any) => void;
  bridge: string;
}

export const Connect: React.FC<Props> = ({ setResults, bridge }) => {
  const { walletConnectService: wcs } = useWalletConnect();
  useEffect(() => {
    const connectEvent = (result: any) => {
      setResults({
        action: 'connect',
        status: 'success',
        message: 'WalletConnectJS | Connected',
        data: result,
      });
    };
    wcs.addListener(WINDOW_MESSAGES.CONNECTED, connectEvent);

    return () => {
      wcs.removeListener(WINDOW_MESSAGES.CONNECTED, connectEvent);
    };
  }, [wcs, setResults]);

  return (
    <Button width="200px" onClick={() => wcs.connect(bridge)}>
      Connect
    </Button>
  );
};
