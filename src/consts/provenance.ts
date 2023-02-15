import { ProvenanceMethod } from '../types';

export const PROVENANCE_METHODS: { sign: ProvenanceMethod; send: ProvenanceMethod, action: ProvenanceMethod } =
  {
    sign: 'provenance_sign',
    send: 'provenance_sendTransaction',
    action: 'wallet_action',
  };
