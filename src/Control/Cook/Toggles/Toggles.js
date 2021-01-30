// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// Include component stylings
import './toggles.scss';

class Toggles extends Component {
  constructor(props) {
    super(props);

    // Handle state for the three toggles.
    this.state = {
      confetti: 'stop',
      bubbles: 'stop',
      notice: false,
      banner: false
    }

    this.handleConfetti = this.handleConfetti.bind(this);
    this.handleBubbles = this.handleBubbles.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  }

  componentDidMount() {
    // Listen for confetti state updates.
    this.props.socket.on('confetti-state', (msg) => {
      console.log('Toggles.js | confetti-stage | Confetti State: ' + msg.state);
      this.setState({
        confetti: msg.state
      })
    });

    // Listen for bubbles state updates.
    this.props.socket.on('bubbles-state', (msg) => {
      console.log('Toggles.js | bubbles-stage | Bubble State: ' + msg.state);
      this.setState({
        bubbles: msg.state
      })
    });

    // Listen for notice state updates.
    this.props.socket.on('notice-info', (msg) => {
      console.log('Toggles.js | notice-info | Notify State: ' + msg.show);
      if(msg.show === 'show') {this.setState({ notice: true })}
      if(msg.show === 'hide') {this.setState({ notice: false })}
    });

    // Listen for banner state updates.
    this.props.socket.on('banner-fetch', (msg) => {
      console.log('Toggles.js | banner-fetch | Banner State: ' + msg.show);
      this.setState({ banner: msg.show });
    });
  }

  // Toggle the confetti.
  handleConfetti() {
    console.log('Toggles.js | confetti-toggle');
    this.props.socket.emit('confetti-toggle');
  }

  // Toggle the bubbles.
  handleBubbles() {
    console.log('Toggles.js | bubbles-toggle');
    this.props.socket.emit('bubbles-toggle');
  }

  // Toggle the notification allert.
  // Users "Producer" for toggles created by control panel.
  handleNotify() {
    if(this.state.notice) {
      console.log('Toggles.js | notice-update | Notice State: hide');
      this.props.socket.emit('notice-update', { show: false, user: 'Producer', sound: 'hey'});
      this.setState({notice: false});
    }
    else {
      console.log('Toggles.js | notice-update | Notice State: show');
      this.props.socket.emit('notice-update', { show: true, user: 'Producer', sound: 'hey'});
      this.setState({notice: true})
    }
  }

  // Toggle the banner.
  // TODO: Verify that this works correctly?
  handleBanner() {
    if(this.state.banner) {
      console.log('Toggles.js | banner-update | BAnner State: hide');
      this.props.socket.emit('banner-update', { show: 'hide'});
      this.setState({banner: false});
    }
    else {
      console.log('Toggles.js | banner-update | BAnner State: show');
      this.props.socket.emit('banner-update', { show: 'show' });
      this.setState({banner: true})
    }
  }


  render() {
    // Set the Confetti toggle button's state.
    // Note, the toggle gets distabled while the confetti is in "stopping" mode.
    // A change is made to the BootstrapSwitchButton's 'key' field to deal with a toggle button bug.
    let confettiChecked = false;
    if(this.state.confetti === 'start') { confettiChecked = true; }
    else if(this.state.confetti === 'stopping') { confettiChecked = false; }
    else if(this.state.confetti === 'stop') { confettiChecked = false; }

    // Set the bubbles toggle button's state.
    // Note, the toggle gets distabled while the bubbles is in "stopping" mode.
    // A change is made to the BootstrapSwitchButton's 'key' field to deal with a toggle button bug.
    let bubblesChecked = false;
    if(this.state.bubbles === 'start') { bubblesChecked = true; }
    else if(this.state.bubbles === 'stopping') { bubblesChecked = false; }
    else if(this.state.bubbles === 'stop') { bubblesChecked = false; }

    return (
      <Card className="timers-list">
        <Card.Header>Toggles</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Form.Row>
              <Col xs={8} className="toggle-label">Confetti</Col>
              <Col xs={4} className="toggle-switch">
                <BootstrapSwitchButton
                  checked={confettiChecked}
                  size="md"
                  offstyle="secondary"
                  onstyle='primary'
                  disabled={(this.state.confetti === 'stopping') ? true : false}
                  onChange={this.handleConfetti}
                  key={(this.state.confetti === 'stopping') ? true : false}
                />
              </Col>
            </Form.Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Row>
              <Col xs={8} className="toggle-label">Bubbles</Col>
              <Col xs={4} className="toggle-switch">
                <BootstrapSwitchButton
                    checked={bubblesChecked}
                    size="md"
                    onstyle='primary'
                    offstyle="secondary"
                    onlabel="On"
                    offlabel="Off"
                    disabled={(this.state.bubbles === 'stopping') ? true : false}
                    onChange={this.handleBubbles}
                    key={(this.state.bubbles === 'stopping') ? true : false}
                  />
              </Col>
            </Form.Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Row>
              <Col xs={8} className="toggle-label">Hey! Listen!</Col>
              <Col xs={4} className="toggle-switch">
                <BootstrapSwitchButton
                  checked={this.state.notice}
                  size="md"
                  offstyle="secondary"
                  onstyle='primary'
                  onChange={this.handleNotify}
                />
              </Col>
            </Form.Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Row>
              <Col xs={8} className="toggle-label">Banner!</Col>
              <Col xs={4} className="toggle-switch">
                <BootstrapSwitchButton
                  checked={this.state.banner}
                  size="md"
                  offstyle="secondary"
                  onstyle='primary'
                  onChange={this.handleBanner}
                />
              </Col>
            </Form.Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  }
}

export default Toggles;