import { WalletId } from '../Wallet';

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
