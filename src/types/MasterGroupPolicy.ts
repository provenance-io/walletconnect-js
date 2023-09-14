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
