import { createContext, useContext, useEffect, useState } from 'react';
import { WalletConnectService } from '../services';

const StateContext = createContext(undefined);
const walletConnectService = new WalletConnectService();

const WalletConnectContextProvider = ({ children }) => { // eslint-disable-line react/prop-types
  const [walletConnectState, setWalletConnectState] = useState({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state

    return () => walletConnectService.removeAllEventListeners();
  }, []);

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
