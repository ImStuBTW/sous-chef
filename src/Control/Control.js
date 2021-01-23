// Import React packages.
import { Component } from 'react';

// Import other node packages.
import io from 'socket.io-client';

// Include Bootstrap styles.
import './main.scss'; // Contains colors.scss & bootstrap.scss
import './control.scss'; // Other main app styles.

// Include React-Bootstrap components
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// Include app componnets
import Cook from './Cook/Cook';
import Prep from './Prep/Prep';
import Config from './Config/Config';

// Open a new socket to our backend.
let socket = io(`http://${window.location.hostname}:3001/`);

// Tabs splits page into 3 main tabs.
// Each tab is a component.
class Control extends Component {
  render() {
    return (
      <Tabs fill defaultActiveKey="cook" id="control-tabs" className="control-tabs">
        <Tab eventKey="cook" title="Cook">
          <Cook socket={socket} />
        </Tab>
        <Tab eventKey="prep" title="Prep">
          <Prep socket={socket} />
        </Tab>
        <Tab eventKey="config" title="Config">
          <Config socket={socket} />
        </Tab>
      </Tabs>
    );
  }
}

export default Control;