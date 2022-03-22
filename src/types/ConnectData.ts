export type ConnectData = {
  params: [
    {
      accounts: [
        address: string, publicKey: string, signedJwt: string,
      ],
      peerMeta: {
        description: string,
        url: string,
        name: string,
        icons: string[],
      }
    }
  ]
};
