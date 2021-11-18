import { Navigate } from 'react-router-dom';
import { Home, NotFound } from 'Pages';

export const HOME_URL = '/';
export const FOUR_OH_FOUR_URL = '404';

const exact = true;

export const routes = [
  { path: HOME_URL, element: <Home />, exact },
  { path: FOUR_OH_FOUR_URL, element: <NotFound />, exact },
  { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
