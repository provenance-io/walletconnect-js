export type DecisionPolicy = {
  typeUrl?: string;
  value?: string;
};

export type MasterGroupPolicy = {
  address?: string;
  groupId?: number;
  admin?: string;
  metadataUuid?: string;
  version?: number;
  decisionPolicy?: DecisionPolicy;
  createdAt?: string;
};

export type WalletInfo = {
  coin?: string;
  id?: number;
  name?: string;
};

export type AccountObject = {
  address: string;
  jwt: string;
  publicKey: string;
  walletInfo: WalletInfo;
  representedGroupPolicy?: MasterGroupPolicy;
};

export type AccountInfo = string[] | AccountObject[] | undefined;

export type ConnectData = {
  params: [
    {
      accounts: AccountInfo;
      peerMeta: {
        description: string;
        url: string;
        name: string;
        icons: string[];
      };
    }
  ];
};
