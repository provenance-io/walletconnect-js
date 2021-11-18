import React, { createContext, useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-extraneous-dependencies, no-unused-vars
import { WalletConnectService } from '../services';

const StateContext = createContext(undefined);
const walletConnectService = new WalletConnectService();

const WalletConnectContextProvider = ({ children, network }) => { // eslint-disable-line react/prop-types
  const [walletConnectState, setWalletConnectState] = useState({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    if (network) { walletConnectService.setNetwork(network)}
    return () => walletConnectService.removeAllEventListeners();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StateContext.Provider value={{ walletConnectService, walletConnectState }}>
      {children}
    </StateContext.Provider>
  );
};

const useWalletConnect = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useWalletConnect must be used within a WalletConnectContextProvider');
  }
  return context;
};

export { WalletConnectContextProvider, useWalletConnect };
