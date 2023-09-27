import { Connect, Root } from 'Page';
import { HOMEPAGE_URL } from 'consts';
import {
  REMOVE_PENDING_METHOD,
  RESET_CONNECTION,
  SEND_COIN,
  SEND_MESSAGE,
  SIGN_JWT,
  SIGN_MESSAGE,
  SWITCH_TO_GROUP_ACTION,
} from './actions';
import { CONNECT } from './connect';
import { DAPP } from './dApp';

export const routes = [
  {
    path: HOMEPAGE_URL,
    element: <Root />,
    children: [
      { index: true, element: <Connect /> },
      CONNECT,
      DAPP,
      RESET_CONNECTION,
      SEND_COIN,
      SEND_MESSAGE,
      SIGN_MESSAGE,
      SIGN_JWT,
      SWITCH_TO_GROUP_ACTION,
      REMOVE_PENDING_METHOD,
    ],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
