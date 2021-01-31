// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// Include component stylings
import './trivia.scss';

class Trivia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false,
      interval: 1200,
    }

    this.handleEnableToggle = this.handleEnableToggle.bind(this);
    this.handleIntervalForm = this.handleIntervalForm.bind(this);
    this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
  }

  componentDidMount() {
    // Listen for triva state info.
    this.props.socket.on('trivia-info', (msg) => {
      console.log('Triva.js | triva-info | Triva Enabled: ' + msg.enabled + ' Interval: ' + msg.interval);
      this.setState({
        enabled: msg.enabled,
        interval: msg.interval
      });
    });

    // Get the triva state when the component first mounts.
    this.props.socket.emit('trivia-fetch', (msg) => {
      this.setState({
        enabled: msg.enabled,
        interval: msg.interval
      });
    });
  }

  // Turn reminders on.
  handleEnableToggle() {
    this.props.socket.emit('trivia-update', {enabled: !this.state.enabled, interval: this.state.interval}, (msg) => {
      this.setState({
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  // Handle the form input
  handleIntervalForm(event) {
    if(event.target.value) {
      this.setState({ interval: parseInt(event.target.value) })
    }
    else {
      this.setState({ interval: '' })
    }
  }

  // Handle when people click the Update button.
  handleIntervalUpdate() {
    this.props.socket.emit('trivia-update', {enabled: this.state.enabled, interval: this.state.interval}, (msg) => {
      this.setState({
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  render() {
    return (
      <Card className="triva-panel">
        <Card.Header>Triva Bot</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row className="triva-toggle">
              <Col xs={8} className="producers-toggle-label">Enable Triva:</Col>
              <Col xs={4} className="producers-toggle-switch">
                <BootstrapSwitchButton
                  checked={this.state.enabled}
                  size="md"
                  onstyle='primary'
                  offstyle="secondary"
                  onChange={this.handleEnableToggle}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <InputGroup className="triva-interval">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Triva Interval:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl type="number" placeholder="Seconds" value={this.state.interval} onChange={this.handleIntervalForm} />
                  <InputGroup.Append>
                    <Button variant="primary" onClick={this.handleIntervalUpdate} >Update</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Trivia;