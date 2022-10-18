import { SEND_MESSAGE_URL, SIGN_JWT_URL, SIGN_MESSAGE_URL } from 'consts';
import { SignJWT } from 'Page';

export const SIGN_JWT = {
  path: SIGN_JWT_URL,
  element: <SignJWT />,
};

export const SIGN_MESSAGE = {
  path: SIGN_MESSAGE_URL,
  element: <SignJWT />,
};

export const SEND_MESSAGE = {
  path: SEND_MESSAGE_URL,
  element: <SignJWT />,
};
