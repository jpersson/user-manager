import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {IndexRoute, Route, Router} from 'react-router';
import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';
import useRelay from 'react-router-relay';


import App from './components/App';
import UserList from './components/UserList';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const managerQueries = { manager: () => Relay.QL`query { manager }` }

ReactDOM.render(
  <Router
    environment={Relay.Store}
    history={history}
    render={applyRouterMiddleware(useRelay)}>
    <Route path="/"
      component={App}
      queries={managerQueries}>
      <IndexRoute
        component={UserList}
        queries={managerQueries}
      />
    </Route>
  </Router>,
  document.getElementById('root')
);
