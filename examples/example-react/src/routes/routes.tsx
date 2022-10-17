import { HOMEPAGE_URL } from 'consts';
import { CONNECT } from './connect';
import { Connect } from 'Page';
import { Root } from 'Page';
import { ACTIONS } from './actions';

export const routes = [
  {
    path: HOMEPAGE_URL,
    element: <Root />,
    children: [{ index: true, element: <Connect /> }, CONNECT, ACTIONS],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
