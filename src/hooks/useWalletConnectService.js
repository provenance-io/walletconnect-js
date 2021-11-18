import React, { useEffect, useRef, useState } from 'react';
import { WalletConnectService } from '../services';

export const useWalletConnectService = () => {
  const walletConnectService = useRef(new WalletConnectService()).current // Note: Why does wallet-lib use "useRef" here?
  const [walletConnectState, setWalletConnectState] = useState({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state

    return () => walletConnectService.removeAllEventListeners();
  }, [walletConnectService]);

  return { walletConnectState, walletConnectService };
};
