// Import React and React-Router components.
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Import pages
import Control from './Control';
import Overlay from './Overlay';

// Import stylings
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path ="/">
          <Control />
        </Route>
        <Route path ="/overlay">
          <Overlay />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);