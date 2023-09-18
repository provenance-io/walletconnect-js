import { WALLET_ACTIONS } from 'consts';
import { ProvenanceMethod } from 'types/Cosmos';

// ----------------------------------
// WALLET_ACTION
// ----------------------------------
export type WalletAction = typeof WALLET_ACTIONS[keyof typeof WALLET_ACTIONS];
export interface WalletActionMethod {
  method?: ProvenanceMethod;
  description?: string;
  action: WalletAction;
  payload?: Record<string, unknown>;
}
