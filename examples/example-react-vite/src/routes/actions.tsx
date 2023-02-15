import {
  RESET_CONNECTION_URL,
  SEND_MESSAGE_URL,
  SIGN_JWT_URL,
  SIGN_HEX_MESSAGE_URL,
  SEND_COIN_URL,
  SEND_WALLET_ACTION_URL,
} from 'consts';
import {
  ResetConnectionTimeout,
  SendMessage,
  SignJWT,
  SignHexMessage,
  SendWalletAction,
  SendCoin,
} from 'Page';

export const RESET_CONNECTION = {
  path: RESET_CONNECTION_URL,
  element: <ResetConnectionTimeout />,
};

export const SEND_MESSAGE = {
  path: SEND_MESSAGE_URL,
  element: <SendMessage />,
};

export const SEND_WALLET_ACTION = {
  path: SEND_WALLET_ACTION_URL,
  element: <SendWalletAction />,
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
