// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// Include component stylings
import './producers.scss';

class Producers extends Component {
  constructor(props) {
    super(props);

    // Comma seperated list of allowed producers.
    // Toggle for if all subscribers can control the cameras.
    this.state = {
      list: '',
      subs: false
    }

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubToggle = this.handleSubToggle.bind(this);
    this.handleProducerUpdate = this.handleProducerUpdate.bind(this);
  }

  componentDidMount() {
    // Get current state from the server when the component mounts.
    this.props.socket.on('obs-scene-control-fetch', (msg) => {
      this.setState({
        list: msg.users.join(','),
        subs: msg.allSubs
      });
    });
  }

  // Handle the form state.
  handleFormChange(event) {
    this.setState({
      list: event.target.value
    });
  }

  // Handle the sub toggle state.
  handleSubToggle() {
    if(this.state.subs) { this.setState({ subs: false }) }
    else { this.setState({ subs: true }) }
  }

  // Submit the user list. Turn it into an array first.
  handleProducerUpdate() {
    console.log('Producers.js | obs-scene-control-set | Users: ' + this.state.list.split(',') + ' , Subs: ' + this.state.subs);
    this.props.socket.emit('obs-scene-control-set', {
      users: this.state.list.split(','),
      allSubs: this.state.subs
    });
  }

  render() {
    return (
      <Card className="producers-panel">
        <Card.Header>Remote Producers</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                <FormControl placeholder="Producer Usernames (Comma Seperated)" value={this.state.list} onChange={this.handleFormChange} />
              </Col>
            </Form.Row>
            <Form.Row className="producers-toggle">
              <Col xs={8} className="producers-toggle-label">Allow for all Subscribers</Col>
              <Col xs={4} className="producers-toggle-switch">
                <BootstrapSwitchButton
                  checked={this.state.subs}
                  size="md"
                  onstyle='primary'
                  offstyle="secondary"
                  onlabel="All Subs"
                  offlabel="Listed"
                  onChange={this.handleSubToggle}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Button className="producers-button" variant="primary" onClick={this.handleProducerUpdate} block>Update Producers</Button>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Producers;