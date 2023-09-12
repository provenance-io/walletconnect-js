import { WalletId } from './Wallet';

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

export interface AccountAttribute {
  name: string;
  value: number;
  type: string;
}

export type AccountObject = {
  address: string;
  attributes: AccountAttribute[];
  jwt: string;
  publicKey: string;
  walletInfo: WalletInfo;
  representedGroupPolicy?: MasterGroupPolicy;
};

export type WalletConnectAccountInfo = string[] | AccountObject[] | undefined;

export type ConnectData = {
  params: [
    {
      accounts: WalletConnectAccountInfo;
      peerMeta: {
        description: string;
        url: string;
        name: string;
        icons: string[];
      };
    }
  ];
};

export interface BrowserConnectParams {
  groupAddress?: string;
  individualAddress?: string;
  connectionDuration: number;
  jwtDuration: number;
  prohibitGroups: boolean;
  walletId: WalletId;
}

export interface WalletConnectResponse {
  accounts?: WalletConnectAccountInfo;
  error?: string;
}
