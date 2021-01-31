// Import React packages.
import { Component } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './obs.scss';

class OBS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false
    }

    this.handleOBSConnect = this.handleOBSConnect.bind(this);
  }

  componentDidMount() {
    // Listen for updates to Twitch status.
    this.props.socket.on('obs-status', (msg) => {
      this.setState({
        status: msg
      });
    });

    // When the component mounts, get the current Twitch status.
    this.props.socket.emit('obs-fetch', (msg) => {
      this.setState({
        status: msg
      });
    });
  }

  handleOBSConnect() {
    this.props.socket.emit('obs-connect', (msg) => {
      console.log('OBS.js | obs-connect | OBS Auth Status: ' + msg);
      this.setState({
        status: msg
      });
    })
  }

  render() {
    return (
      <Card className="reminders-panel">
        <Card.Header>OBS Integration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                {(this.state.status) ?
                <Alert variant="success" className="obs-alert" >OBS Connected Successfully.</Alert>
                :
                <Alert variant="warning" className="obs-alert" >OBS Not Connected.</Alert>
                }
              </Col>
            </Form.Row>
          </Form>
          <Form.Row className="obs-buttons">
            <Col>
              <Button variant="primary" onClick={this.handleOBSConnect} block>Connect to OBS</Button>
            </Col>
          </Form.Row>
        </Card.Body>
      </Card>
    );
  }
}

export default OBS;