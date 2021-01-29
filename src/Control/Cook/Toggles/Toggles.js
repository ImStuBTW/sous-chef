// Import React packages.
import { Component } from 'react';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import './toggles.scss';

class Toggles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confetti: 'stop',
      notice: false,
      banner: false
    }

    this.handleConfetti = this.handleConfetti.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('confetti-state', (msg) => {
      console.log('Toggles.js | confetti-stage | Confetti State: ' + msg.state);
      this.setState({
        confetti: msg.state
      })
    });

    this.props.socket.on('notice-info', (msg) => {
      console.log('Toggles.js | notice-info | Notify State: ' + msg.show);
      if(msg.show === 'show') {this.setState({ notice: true })}
      if(msg.show === 'hide') {this.setState({ notice: false })}
    });

    this.props.socket.on('banner-fetch', (msg) => {
      console.log('Toggles.js | banner-fetch | Banner State: ' + msg.show);
      this.setState({
        banner: msg.show
      })
    });
  }

  handleConfetti() {
    console.log('Toggles.js | confetti-toggle');
    this.props.socket.emit('confetti-toggle');
  }

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
    let confettiChecked = false;
    if(this.state.confetti === 'start') { confettiChecked = true; }
    else if(this.state.confetti === 'stopping') { confettiChecked = false; }
    else if(this.state.confetti === 'stop') { confettiChecked = false; }

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