import { HOMEPAGE_URL } from 'consts';
import { CONNECT } from './connect';
import { Connect } from 'Page';
import { Root } from 'Page';
import {
  RESET_CONNECTION,
  SEND_MESSAGE,
  SEND_COIN,
  SIGN_JWT,
  SIGN_HEX_MESSAGE,
  SEND_WALLET_ACTION,
} from './actions';

export const routes = [
  {
    path: HOMEPAGE_URL,
    element: <Root />,
    children: [
      { index: true, element: <Connect /> },
      CONNECT,
      RESET_CONNECTION,
      SEND_COIN,
      SEND_MESSAGE,
      SIGN_JWT,
      SIGN_HEX_MESSAGE,
      SEND_WALLET_ACTION,
    ],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
