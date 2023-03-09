interface TimePeriod {
  seconds: number;
  nanos: number;
}

interface DecisionPolicy {
  '@type': string;
  threshold: string;
  windows: {
    votingPeriod: TimePeriod;
    minExecutionPeriod: TimePeriod;
  };
}

export type MasterGroupPolicy = {
  address?: string;
  groupId?: number;
  admin?: string;
  metadata?: string;
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
  representedGroupPolicy: MasterGroupPolicy | null;
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
