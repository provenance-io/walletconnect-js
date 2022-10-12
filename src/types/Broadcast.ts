import type { BaseResults } from './BaseResults';
import type { ConnectData } from './ConnectData';
import type { WalletConnectClientType } from './WalletConnectService';

export type Broadcast = (eventName: string, data?: BroadcastResults) => void;

type ConnectResults = {
  data: WalletConnectClientType | ConnectData;
  connectionIat: number;
  connectionEat: number | null;
};

export type BroadcastResults = ConnectResults | BaseResults;
