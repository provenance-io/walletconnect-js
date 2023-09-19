import { GasPrice, ProvenanceMethod } from 'types/Cosmos';

// ----------------------------------
// SEND_MESSAGE
// ----------------------------------
export interface SendMessageMethod {
  customId?: string;
  description?: string;
  extensionOptions?: string[];
  feeGranter?: string;
  feePayer?: string;
  gasPrice?: GasPrice;
  memo?: string;
  message: string | string[];
  method?: ProvenanceMethod;
  nonCriticalExtensionOptions?: string[];
  timeoutHeight?: number;
}
