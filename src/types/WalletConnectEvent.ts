export type WalletconnectEventType =
  | "walletconnect_init"
  | "walletconnect_event";

export type WalletconnectEvent = {
  event: WalletconnectEventType;
  uri?: string;
};
