import { SEND_MESSAGE_URL, SIGN_JWT_URL, SIGN_MESSAGE_URL } from 'consts';
import { SendMessage, SignJWT } from 'Page';

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
  element: <SignJWT />,
};
