import {
  RESET_CONNECTION_URL,
  SEND_MESSAGE_URL,
  SIGN_JWT_URL,
  SIGN_HEX_MESSAGE_URL,
  SEND_COIN_URL,
  SWITCH_TO_GROUP_URL,
} from 'consts';
import {
  ResetConnectionTimeout,
  SendMessage,
  SignJWT,
  SignHexMessage,
  SendCoin,
} from 'Page';
import {SwitchToGroup} from "../Page/SwitchToGroup";

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

export const SIGN_HEX_MESSAGE = {
  path: SIGN_HEX_MESSAGE_URL,
  element: <SignHexMessage />,
};

export const SEND_COIN = {
  path: SEND_COIN_URL,
  element: <SendCoin />,
};
