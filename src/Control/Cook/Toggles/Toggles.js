import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import './toggles.scss';

function Toggles(props) {
  return (
    <Card className="timers-list">
        <Card.Header>Toggles</Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item>
              <Form.Row>
                <Col xs={8} className="toggle-label">Confetti</Col>
                <Col xs={4} className="toggle-switch">
                  <BootstrapSwitchButton
                      checked={false}
                      size="md"
                      offstyle="secondary"
                      onstyle='primary'
                  />
                </Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={8} className="toggle-label">Hey! Listen!</Col>
                <Col xs={4} className="toggle-switch">
                  <BootstrapSwitchButton
                      checked={false}
                      size="md"
                      offstyle="secondary"
                      onstyle='primary'
                  />
                </Col>
              </Form.Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Row>
                <Col xs={8} className="toggle-label">Banner!</Col>
                <Col xs={4} className="toggle-switch">
                  <BootstrapSwitchButton
                      checked={false}
                      size="md"
                      offstyle="secondary"
                      onstyle='primary'
                  />
                </Col>
              </Form.Row>
            </ListGroup.Item>
        </ListGroup>
    </Card>
  );
}

export default Toggles;