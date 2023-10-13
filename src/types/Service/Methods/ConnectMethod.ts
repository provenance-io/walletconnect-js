import type WalletConnectClient from '@walletconnect/client';
import { MessageError } from '../../BrowserWallet';
import { WalletId } from '../../Wallet';
import { PartialState, WCSState } from '../Service';

// WalletConnectService method for connecting (Browser and WC)
export interface ConnectMethod {
  bridge?: string;
  connectionDuration?: number;
  description?: string;
  groupAddress?: string;
  individualAddress?: string;
  jwtDuration?: number;
  jwtExpiration?: number;
  onDisconnect?: (message?: string) => void;
  prohibitGroups?: boolean;
  walletId: WalletId;
}
// Results given back to WalletConnectService from calling function (Browser and WC will have same results)
export interface ConnectFunctionResults {
  state?: PartialState<WCSState>;
  error?: MessageError;
  resetState?: boolean;
  connector?: WalletConnectClient;
}
// Results given back to the dApp from wcjs
export interface ConnectMethodResults {
  result?: {
    connectionEST: number;
    connectionEXP: number;
    connectionType: 'existing session' | 'new session';
  };
  error?: MessageError;
}