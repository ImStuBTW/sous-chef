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


class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "cook"
    }
  }

  handleTab(key) {
    this.setState({key: key});
  }

  // When the control panel loads, check and see if we're coming back from either of the two callback routes.
  // This hook has an absurd amount of if tastements to make sure nothing that's acted upon is null.
  // If you're not on the callbacks, the normal control panel page will fire without loading this.
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
              this.handleTab('config');
            }
            if(window.location.pathname === '/ownercallback') {
              socket.emit('twitch-connect-owner-callback', params.access_token, (msg) => {
                console.log(`Twitch.js | twitch-connect-owner-callback | Twitich Bot Auth Token : ${params.access_token}`);
                this.setState({ botStatus: true });
              });
              this.handleTab('config');
            }
          }
        }
      }
    }
  }

// Tabs splits page into 3 main tabs.
// Each tab is a component.
  render() {
    return (
      <Tabs fill activeKey={this.state.key} onSelect={(key) => this.handleTab(key)} id="control-tabs" className="control-tabs">
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