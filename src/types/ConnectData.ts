export type ConnectData = {
  params: [
    {
      accounts: string[] | {
        address: string, publicKey: string, jwt: string, walletInfo: {
          coin?: string,
          id?: number,
          name?: string,
        }
      },
      peerMeta: {
        description: string,
        url: string,
        name: string,
        icons: string[],
      }
    }
  ]
};
