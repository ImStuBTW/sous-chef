import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import twitchIcon from '../../../Icons/twitch.png';

import './twitch.scss';

function Twitch(props) {
  return (
    <Card className="reminders-panel">
        <Card.Header><img src={twitchIcon} className="twitch-icon" alt="Twitch" />Twitch Integration</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col>
                        <Alert variant="success" className="twitch-alert">Twitch Authenticated Successfully.</Alert>
                    </Col>
                </Form.Row>
            </Form>
            <Form.Row className="twitch-buttons">
                <Col>
                    <Button variant="primary" block>Connect Bot to Twitch</Button>
                </Col>
                <Col>
                    <Button variant="primary" block>Broadcaster Login</Button>
                </Col>
            </Form.Row>
        </Card.Body>
    </Card>
  );
}

export default Twitch;