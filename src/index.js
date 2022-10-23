// Import React and React-Router components.
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Import pages
import Control from './Control/Control';
import Overlay from './Overlay/Overlay';

// Import stylings
import './index.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path ="/">
        <Control />
      </Route>
      <Route exact path ="/botcallback">
        <Control />
      </Route>
      <Route exact path ="/ownercallback">
        <Control />
      </Route>
      <Route path ="/overlay">
        <Overlay />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);