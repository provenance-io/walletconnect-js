import { ProvenanceMethod } from '../types';

export const PROVENANCE_METHODS: { sign: ProvenanceMethod; send: ProvenanceMethod } =
  {
    sign: 'provenance_sign',
    send: 'provenance_sendTransaction',
  };
