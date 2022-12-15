import {
  AUTOCONNECT_URL,
  FIGURE_DAPP_CONNECT_URL,
  RESET_CONNECTION_URL,
  SEND_MESSAGE_URL,
  SIGN_JWT_URL,
  SIGN_MESSAGE_URL,
} from 'consts';
import {
  AutoConnect,
  ResetConnectionTimeout,
  SendMessage,
  SignJWT,
  SignMessage,
  FigureDAppConnect,
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

export const FIGURE_DAPP_CONNECT = {
  path: FIGURE_DAPP_CONNECT_URL,
  element: <FigureDAppConnect />,
};
