import React from 'react';
import { WalletConnectService } from '../services';
import type { WCSState } from '../types';
interface ProviderState {
    walletConnectService: WalletConnectService;
    walletConnectState: WCSState;
}
interface Props {
    children: React.ReactNode;
    timeout?: number;
}
declare const WalletConnectContextProvider: React.FC<Props>;
declare const useWalletConnect: () => ProviderState;
export { WalletConnectContextProvider, useWalletConnect };
