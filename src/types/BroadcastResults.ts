import WalletConnectClient from "@walletconnect/client";
import { BaseResults } from './BaseResults';
import { ConnectData } from './ConnectData';

type ConnectResults = {
  data: WalletConnectClient | ConnectData,
  connectionIat: number,
  connectionEat: number | null,
  connectionType: string,
}

export type BroadcastResults = ConnectResults | BaseResults;
