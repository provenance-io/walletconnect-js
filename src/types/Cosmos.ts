interface Attribute {
  key: string;
  value: string;
}
interface StringEvent {
  type: string;
  attributesList: Attribute[];
}
interface ABCIMessageLog {
  msgIndex: number;
  log: string;
  eventsList: StringEvent[];
}
interface EventAttribute {
  key: Uint8Array | string;
  value: Uint8Array | string;
  index: boolean;
}
interface Event {
  type: string;
  attributesList: EventAttribute[];
}
interface Any {
  typeUrl: string;
  value: Uint8Array | string;
}

export interface TxResponse {
  height: number;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  rawLog: string;
  logsList: ABCIMessageLog[];
  info: string;
  gasWanted: number;
  gasUsed: number;
  tx?: Any;
  timestamp: string;
  eventsList: Event[];
}

export type GasPrice = {
  gasPrice: number;
  gasPriceDenom: string;
};
