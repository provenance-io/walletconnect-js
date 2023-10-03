import {
  REMOVE_PENDING_METHOD_URL,
  RESET_CONNECTION_URL,
  SEND_TX_URL,
  SIGN_JWT_URL,
  SIGN_URL,
  SWITCH_TO_GROUP_URL,
} from 'consts';
import {
  RemovePendingMethod,
  ResetConnectionTimeout,
  SendTx,
  Sign,
  SignJWT,
  SwitchToGroup,
} from 'Page';

export const REMOVE_PENDING_METHOD = {
  path: REMOVE_PENDING_METHOD_URL,
  element: <RemovePendingMethod />,
};

export const RESET_CONNECTION = {
  path: RESET_CONNECTION_URL,
  element: <ResetConnectionTimeout />,
};

export const SEND_TX = {
  path: SEND_TX_URL,
  element: <SendTx />,
};

export const SWITCH_TO_GROUP_ACTION = {
  path: SWITCH_TO_GROUP_URL,
  element: <SwitchToGroup />,
};

export const SIGN_JWT = {
  path: SIGN_JWT_URL,
  element: <SignJWT />,
};

export const SIGN = {
  path: SIGN_URL,
  element: <Sign />,
};
