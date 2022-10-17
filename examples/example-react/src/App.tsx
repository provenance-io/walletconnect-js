import { routes } from 'routes';
import { useRoutes } from 'react-router-dom';

export const App = () => {
  const routing = useRoutes(routes);

  return routing;
};
