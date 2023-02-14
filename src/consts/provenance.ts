import { ProvenanceMethod } from '../types';

export const PROVENANCE_METHODS: { sign: ProvenanceMethod; send: ProvenanceMethod, message: ProvenanceMethod } =
  {
    sign: 'provenance_sign',
    send: 'provenance_sendTransaction',
    message: 'wallet_message',
  };
