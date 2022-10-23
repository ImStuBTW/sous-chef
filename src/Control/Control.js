// Import React packages.
import { Component } from 'react';
import qs from 'qs';

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
componentDidMount() {
  if(window.location.pathname) {
    if(window.location.hash) {
      const params = qs.parse(window.location.hash.substring(1));
      if(params) {
        if(params.access_token) {
          if(window.location.pathname === '/botcallback') {
            socket.emit('twitch-connect-bot-callback', params.access_token, (msg) => {
              console.log(`Twitch.js | twitch-connect-bot-callback | Twitich Bot Auth Token : ${params.access_token}`);
              this.setState({ botStatus: true });
            });
          }
          if(window.location.pathname === '/ownercallback') {
            socket.emit('twitch-connect-owner-callback', params.access_token, (msg) => {
              console.log(`Twitch.js | twitch-connect-owner-callback | Twitich Bot Auth Token : ${params.access_token}`);
              this.setState({ botStatus: true });
            });
          }
        }
      }
    }
  }
}

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
  };
}

export default Control;