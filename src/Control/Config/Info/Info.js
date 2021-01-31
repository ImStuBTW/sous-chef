// Import React packages.
import { Component } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import './info.scss';

class Info extends Component {
  constructor(props) {
    super(props);

    this.state = { ip: '127.0.0.1', port: 3000 };
  }

  componentDidMount() {
    // Listen for IP info.
    this.props.socket.on('utility-ip', (msg) => {
      this.setState({ ip: msg.ip, port: msg.port });
    });

    // Fetch IP info when mounting.
    this.props.socket.emit('utility-fetch');
  }

  render() {
    let bonjour = 'http://souschef.local/';
    if(this.state.port !== 80) { bonjour = 'http://souschef.local:' + this.state.port + '/'; }
    let ipAddr = 'http://' + this.state.ip + '/';
    if(this.state.port !== 80) { ipAddr = 'http://' + this.state.ip + ':' + this.state.port + '/'; }
    let localHost = 'http://localhost/';
    if(this.state.port !== 80) { localHost = 'http://localhost:' + this.state.port + '/'; }

    return (
      <Card className="info-panel">
        <Card.Header>Sous Chef Information</Card.Header>
        <Card.Body className="info-panel-body">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Homepage (Bonjour)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={bonjour}>{bonjour}</a></Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Homepage (LAN)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={ipAddr}>{ipAddr}</a></Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Homepage (Localhost)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={localHost}>{localHost}</a></Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Overlay (Bonjour)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={bonjour + 'overlay'}>{bonjour + 'overlay'}</a></Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Overlay (LAN)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={ipAddr + 'overlay'}>{ipAddr + 'overlay'}</a></Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={6} className="info-page">Overlay (Localhost)</Col>
                <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href={localHost + 'overlay'}>{localHost + 'overlay'}</a></Col>
              </Form.Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}

export default Info;