export interface Field {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  width?: string;
}
export type WindowMessages =
  | 'MARKER_ACTIVATE'
  | 'MARKER_FINALIZE'
  | 'MARKER_ADD'
  | 'CANCEL_REQUEST'
  | 'CUSTOM_ACTION'
  | 'DELEGATE_HASH'
  | 'TRANSACTION'
  | 'TRANSACTION'
  | 'SIGN_JWT'
  | 'SIGNATURE'
  | 'TRANSACTION';

export type WCJSMethod =
  | 'markerActivate'
  | 'markerFinalize'
  | 'markerAdd'
  | 'cancelRequest'
  | 'customAction'
  | 'delegateHash'
  | 'sendCoin'
  | 'signJWT'
  | 'signMessage';

export interface Action {
  windowMessage: WindowMessages;
  method: WCJSMethod;
  gas?: boolean;
  fields: Field[];
  multiAction?: boolean;
}
