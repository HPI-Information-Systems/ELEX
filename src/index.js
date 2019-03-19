import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'containers/App';
import store from 'store';

const renderApp = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Component />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
};

renderApp(App);
