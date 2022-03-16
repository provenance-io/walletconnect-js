import { BroadcastResults } from './BroadcastResults';

export type Broadcast = (
  eventName: string,
  data?: BroadcastResults
) => void