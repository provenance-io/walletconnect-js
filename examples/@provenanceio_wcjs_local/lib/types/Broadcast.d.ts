import type { BaseResults } from './BaseResults';
import type { ConnectData } from './ConnectData';
import type { WalletConnectClientType } from './WalletConnectService';
export declare type Broadcast = (eventName: string, data?: BroadcastResults) => void;
declare type ConnectResults = {
    data: WalletConnectClientType | ConnectData;
    connectionIat: number;
    connectionEat: number | null;
};
export declare type BroadcastResults = ConnectResults | BaseResults;
export {};
