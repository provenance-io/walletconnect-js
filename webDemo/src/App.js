import { useRoutes } from 'react-router-dom';
import { Page } from 'Components';
import { routes } from './routes';

export const App = () => {
  const routing = useRoutes(routes, process.env.PUBLIC_URL);

  return <Page>{routing}</Page>;
};
