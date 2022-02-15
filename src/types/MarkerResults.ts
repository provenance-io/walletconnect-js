import { BaseResults } from './BaseResults';

export type MarkerResults = BaseResults & {
  message?: string,
  sendDetails?: string,
};
