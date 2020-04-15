import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './index';

const AppRouter: React.FC = () => (
  <Switch>
    {routes.map((route, key) => (
      <Route
        key={String(key)}
        path={route.path}
        component={route.component}
        exact={route.exact === true}
      />
    ))}
  </Switch>
);

export default AppRouter;
