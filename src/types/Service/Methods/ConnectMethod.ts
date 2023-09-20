import type WalletConnectClient from '@walletconnect/client';
import { WalletId } from '../../Wallet';
import { PartialState, WCSState } from '../Service';

export interface ConnectMethodService {
  bridge?: string;
  connectionDuration?: number;
  jwtDuration?: number;
  individualAddress?: string;
  groupAddress?: string;
  prohibitGroups?: boolean;
  jwtExpiration?: number;
  walletId?: WalletId;
  onDisconnect?: (message?: string) => void;
}

// TODO: This might be the results for every method, or at least should be...
export interface ConnectMethodServiceFunctionResults {
  state?: PartialState<WCSState>;
  error?: string;
  resetState?: boolean;
  connector?: WalletConnectClient;
}
