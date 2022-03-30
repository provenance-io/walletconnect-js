export type WalletInfo = {
  coin?: string,
    id?: number,
    name?: string,
}

export type AccountObject = {
  address: string,
  jwt: string,
  publicKey: string,
  walletInfo: WalletInfo,
}

export type AccountInfo = string[] | AccountObject[] | undefined;

export type ConnectData = {
  params: [
    {
      accounts: AccountInfo,
      peerMeta: {
        description: string,
        url: string,
        name: string,
        icons: string[],
      }
    }
  ]
};
