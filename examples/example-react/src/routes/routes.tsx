import { HOMEPAGE_URL } from 'consts';
import { CONNECT } from './connect';
import { Connect } from 'Page';
import { Root } from 'Page';
import {
  AUTO_CONNECT,
  FIGURE_DAPP_CONNECT,
  RESET_CONNECTION,
  SEND_MESSAGE,
  SIGN_JWT,
  SIGN_MESSAGE,
} from './actions';

export const routes = [
  {
    path: HOMEPAGE_URL,
    element: <Root />,
    children: [
      { index: true, element: <Connect /> },
      AUTO_CONNECT,
      CONNECT,
      RESET_CONNECTION,
      SEND_MESSAGE,
      SIGN_JWT,
      SIGN_MESSAGE,
      FIGURE_DAPP_CONNECT,
    ],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
