// Import React packages.
import { Component } from 'react';

// Import Javascript packages.
import uuid from 'uuid';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// Include app components.
import ReminderEntry from './ReminderEntry';

// Include icons
import plusIcon from '../../../Icons/plus.png';

// Include component stylings
import './reminders.scss';

class Reminders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false,
      interval: 10,
      messages: [],
      newMessage: ''
    }

    this.handleEnableToggle = this.handleEnableToggle.bind(this);
    this.handleIntervalForm = this.handleIntervalForm.bind(this);
    this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
    this.handleNewMessageForm = this.handleNewMessageForm.bind(this);
    this.handleNewMessageAdd = this.handleNewMessageAdd.bind(this);
    this.handleMessageRemove = this.handleMessageRemove.bind(this);
  }

  componentDidMount() {
    // Listen for message state updates.
    this.props.socket.on('message-info', (msg) => {
      console.log('Reminders.js | message-info | Reminders Enabled: ' + msg.enabled + ' Interval: ' + msg.interval);
      console.log(msg.messages);
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      })
    })

    // When component mounts, get current state.
    this.props.socket.emit('message-fetch', (msg) => {
      console.log('Reminders.js | message-fetch | Reminders Enabled: ' + msg.enabled + ' Interval: ' + msg.interval);
      //if(msg.messages) { console.log(msg.messages); }
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      })
    })
  }

  // Turn reminders on.
  handleEnableToggle() {
    this.props.socket.emit('message-update', {messages: this.state.messages, interval: this.state.interval, enabled: !this.state.enabled}, (msg) => {
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  // Handle interval form updates.
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
    this.props.socket.emit('message-update', {messages: this.state.messages, interval: this.state.interval, enabled: this.state.enabled}, (msg) => {
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  // Handle when people type in a new message.
  handleNewMessageForm(event) {
    this.setState({ newMessage: event.target.value });
  }

  // Add the message to the reminder bot list.
  handleNewMessageAdd() {
    this.props.socket.emit('message-update',
                           {messages: [...this.state.messages, {id: uuid(), text: this.state.newMessage, enabled: true}],
                           interval: this.state.interval,
                           enabled: this.state.enabled},
                           (msg) => {
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  // Delete a specific message.
  // Is passed to ReminderEntry.js as a callback prop.
  handleMessageRemove(deleteId) {
    this.props.socket.emit('message-update',
                           {messages: this.state.messages.filter((message) => { return message.id !== deleteId }),
                           interval: this.state.interval,
                           enabled: this.state.enabled},
                           (msg) => {
      this.setState({
        messages: msg.messages,
        interval: msg.interval,
        enabled: msg.enabled
      });
    });
  }

  render() {
    // Render the reminder list first, if there are any reminders.
    let ReminderList = <></>;
    if(this.state.messages.length !== 0) {
      ReminderList = this.state.messages.map((message) => {
        return <ReminderEntry key={message.id} messageId={message.id} message={message.text} deleteCallback={this.handleMessageRemove} />;
      })
    }

    return (
      <Card className="reminders-panel">
        <Card.Header>Reminders Bot</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row className="reminders-toggle">
              <Col xs={8} className="producers-toggle-label">Enable Reminders:</Col>
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
                <InputGroup className="reminders-interval">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Interval:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl type="number" placeholder="Seconds" value={this.state.interval} onChange={this.handleIntervalForm} />
                  <InputGroup.Append>
                    <Button variant="primary" onClick={this.handleIntervalUpdate}>Update</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Card className="reminder-list" style={{ width: '100%' }}>
                  <Card.Header>Current Reminders:</Card.Header>
                  <ListGroup variant="flush">
                    {ReminderList}
                    <ListGroup.Item>
                      <Form.Row>
                        <Col xs={10} className="reminder-form">
                          <FormControl placeholder="New Reminder" value={this.state.newMessage} onChange={this.handleNewMessageForm} />
                        </Col>
                        <Col xs={2}>
                          <Button className="reminder-add-button" variant="primary" onClick={this.handleNewMessageAdd} block>
                            <img className="reminder-add-icon" src={plusIcon} alt="Remove Message" />
                          </Button>
                        </Col>
                      </Form.Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Reminders;