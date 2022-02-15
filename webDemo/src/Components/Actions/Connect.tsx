import { useEffect } from 'react';
import { WINDOW_MESSAGES } from '@provenanceio/walletconnect-js';
import PropTypes from 'prop-types';
import { Button } from 'Components';

export const Connect = ({ walletConnectService, setResults }) => {
  useEffect(() => {
    walletConnectService.addListener(WINDOW_MESSAGES.CONNECTED, (result) => {
      setResults({
        action: 'connect',
        status: 'success',
        message: 'WalletConnectJS | Connected',
        data: result,
      });
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.CONNECTED);
    }
  }, [walletConnectService, setResults]);

  return <Button width="20%" onClick={walletConnectService.connect}>Connect</Button>
};

Connect.propTypes = {
  walletConnectService: PropTypes.shape({
    connect: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  setResults: PropTypes.func.isRequired,
};
