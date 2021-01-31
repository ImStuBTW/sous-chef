// Import React packages.
import { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Twitch from './Twitch/Twitch';
import OBS from './OBS/OBS';
import Info from './Info/Info';

class Config extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            <Twitch socket={this.props.socket} />
          </Col>
        </Row>
        <Row>
          <Col>
            <OBS socket={this.props.socket} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Info socket={this.props.socket} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Config;
