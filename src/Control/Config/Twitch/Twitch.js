// Import React packages.
import { Component } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import twitchIcon from '../../../Icons/twitch.png';

import './twitch.scss';

class Twitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      botStatus: false,
      broadcasterStatus: false
    }

    // Listen for updates to Twitch bot status.
    this.props.socket.on('twitch-bot-status', (msg) => {
      console.log('Twitch.js | twitch-bot-status: ' + msg);
      this.setState({
        botStatus: msg
      });
    });

    // Listen for updates to Twitch broadcaster status.
    this.props.socket.on('twitch-broadcaster-status', (msg) => {
      console.log('Twitch.js | twitch-broadcaster-status: ' + msg);
      this.setState({
        broadcasterStatus: msg
      });
    });
    
    // When the component mounts, get the current Twitch bot status.
    this.props.socket.emit('twitch-bot-fetch', (msg) => {
      console.log('Twitch.js | twitch-bot-fetch: ' + msg);
      this.setState({
        botStatus: msg
      });
    });

    // When the component mounts, get the current Twitch broadcaster status.
    this.props.socket.emit('twitch-broadcaster-fetch', (msg) => {
      console.log('Twitch.js | twitch-broadcaster-fetch: ' + msg);
      this.setState({
        broadcasterStatus: msg
      });
    });

    this.handleBotConnect = this.handleBotConnect.bind(this);
    this.handleLoginConnect = this.handleLoginConnect.bind(this);
  }

  handleBotConnect() {
    this.props.socket.emit('twitch-connect-bot', (msg) => {
      console.log(`Twitch.js | twitch-connect-bot | Twitich Bot Auth Status: ${msg.status}`);
      console.log(msg.status);
      this.setState({
        botStatus: msg.status
      });
    });
  }

  handleLoginConnect() {
    this.props.socket.emit('twitch-connect-owner', (msg) => {
      console.log(`Twitch.js | twitch-connect-owner | Twitch Broadcaster Auth Status: ${msg.status}`);
      console.log(msg.status);
      this.setState({
        broadcasterStatus: msg.status
      });
    });
  }

  render() {
    return (
      <Card className="reminders-panel">
        <Card.Header><img src={twitchIcon} className="twitch-icon" alt="Twitch" />Twitch Integration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                {(this.state.botStatus) ?
                <Alert variant="success" className="twitch-alert">Twitch Bot Authenticated.</Alert>
                :
                <Alert variant="warning" className="twitch-warning">Twitch Bot Not Authenticated.</Alert>
                }
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                {(this.state.broadcasterStatus) ?
                <Alert variant="success" className="twitch-alert">Twitch Broadcaster Authenticated.</Alert>
                :
                <Alert variant="warning" className="twitch-warning">Twitch Broadcaster Not Authenticated.</Alert>
                }
              </Col>
            </Form.Row>
          </Form>
          <Form.Row className="twitch-buttons">
            <Col>
              <Button variant="primary" onClick={this.handleBotConnect} block>Connect Bot to Twitch</Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleLoginConnect} block>Broadcaster Login</Button>
            </Col>
          </Form.Row>
        </Card.Body>
      </Card>
    );
  }
}

export default Twitch;