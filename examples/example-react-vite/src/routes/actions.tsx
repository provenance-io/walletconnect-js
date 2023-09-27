import {
  REMOVE_PENDING_METHOD_URL,
  RESET_CONNECTION_URL,
  SEND_COIN_URL,
  SEND_MESSAGE_URL,
  SIGN_JWT_URL,
  SIGN_MESSAGE_URL,
  SWITCH_TO_GROUP_URL
} from 'consts';
import {
  RemovePendingMethod,
  ResetConnectionTimeout,
  SendCoin,
  SendMessage,
  SignJWT,
  SignMessage,
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

export const SEND_MESSAGE = {
  path: SEND_MESSAGE_URL,
  element: <SendMessage />,
};

export const SWITCH_TO_GROUP_ACTION = {
  path: SWITCH_TO_GROUP_URL,
  element: <SwitchToGroup />,
};

export const SIGN_JWT = {
  path: SIGN_JWT_URL,
  element: <SignJWT />,
};

export const SIGN_MESSAGE = {
  path: SIGN_MESSAGE_URL,
  element: <SignMessage />,
};

export const SEND_COIN = {
  path: SEND_COIN_URL,
  element: <SendCoin />,
};
