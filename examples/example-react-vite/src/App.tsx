import { useRoutes } from 'react-router-dom';
import { routes } from 'routes';

export const App = () => {
  const routing = useRoutes(routes);
  return routing;
};
