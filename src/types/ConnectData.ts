interface TimePeriod {
  seconds: number;
  nanos: number;
}

export interface Metadata {
  name?: string;
  description?: string;
  email?: string;
  masterPolicy?: boolean;
  isSingleSigner?: boolean;
}

interface DecisionPolicy {
  '@type': string;
  threshold: string;
  windows: {
    votingPeriod: TimePeriod;
    minExecutionPeriod: TimePeriod;
  };
}

export interface GroupMember {
  groupId: number;
  address: string;
  weight: string;
  metadata?: Metadata;
  addedAt: string;
  hasApproved: boolean;
}

export type MasterGroupPolicy = {
  address?: string;
  groupId?: number;
  admin?: string;
  metadata?: Metadata;
  version?: number;
  decisionPolicy?: DecisionPolicy;
  createdAt?: string;
  groupData?: {
    metadata?: Metadata;
    totalWeight?: string;
    members?: GroupMember[];
  };
};

export type WalletInfo = {
  coin?: string;
  id?: number;
  name?: string;
};

export type AccountAttributes = {
  name: string;
  value: number;
  type: string;
}[];

export type AccountObject = {
  address: string;
  attributes: AccountAttributes;
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
