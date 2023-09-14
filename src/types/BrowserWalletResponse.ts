import { AccountObject } from './Wallet';

interface ResponseError {
  message: string;
}
interface ConnectReponse {
  request: {
    browserEvent: string; // TODO: Get this type
    connectionDuration: number;
    groupAddress?: string;
    individualAddress?: string;
    jwtDuration: number;
    method: string; // TODO: Get this type
    prohibitGroups: boolean;
    requestFavicon?: string[];
    requestName?: string;
    requestOrigin?: string;
  };
  result: {
    chainId: string; // TODO: Get this type
    accounts: AccountObject;
  };
  error?: ResponseError;
  accounts: string[];
}

export interface BrowserWalletResponse {
  connect: ConnectReponse;
  disconnect: string;
}
