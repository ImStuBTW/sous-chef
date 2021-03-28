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
      status: false
    }

    // Listen for updates to Twitch status.
    this.props.socket.on('twitch-status', (msg) => {
      console.log('Twitch.js | twitch-status: ' + msg);
      this.setState({
        status: msg
      });
    });

    // When the component mounts, get the current Twitch status.
    this.props.socket.emit('twitch-fetch', (msg) => {
      console.log('Twitch.js | twitch-fetch: ' + msg);
      this.setState({
        status: msg
      });
    });

    this.handleBotConnect = this.handleBotConnect.bind(this);
    this.handleLoginConnect = this.handleLoginConnect.bind(this);
  }

  handleBotConnect() {
    this.props.socket.emit('twitch-connect-bot', (msg) => {
      console.log('Twitch.js | twitch-connect-bot | Twitich Bot Auth Status: ' + msg.status);
      console.log(msg.status);
      this.setState({
        status: msg.status
      });
    })
  }

  handleLoginConnect() {
    this.props.socket.emit('twitch-connect-owner', (msg) => {
      console.log('Twitch.js | twitch-connect-owner | Twitich Broadcaster Auth Started.')
    })
  }

  render() {
    return (
      <Card className="reminders-panel">
        <Card.Header><img src={twitchIcon} className="twitch-icon" alt="Twitch" />Twitch Integration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                {(this.state.status) ?
                <Alert variant="success" className="twitch-alert">Twitch Bot Authenticated Successfully.</Alert>
                :
                <Alert variant="warning" className="twitch-warning">Twitch Bot Not Authenticated.</Alert>
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