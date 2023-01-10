import {
  AUTOCONNECT_URL,
  RESET_CONNECTION_URL,
  SEND_MESSAGE_URL,
  SIGN_JWT_URL,
  SIGN_MESSAGE_URL,
  SEND_COIN_URL,
} from 'consts';
import {
  AutoConnect,
  ResetConnectionTimeout,
  SendMessage,
  SignJWT,
  SignMessage,
  SendCoin,
} from 'Page';

export const AUTO_CONNECT = {
  path: AUTOCONNECT_URL,
  element: <AutoConnect />,
};
export const RESET_CONNECTION = {
  path: RESET_CONNECTION_URL,
  element: <ResetConnectionTimeout />,
};

export const SEND_MESSAGE = {
  path: SEND_MESSAGE_URL,
  element: <SendMessage />,
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
