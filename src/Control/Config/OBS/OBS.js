import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './obs.scss';

function OBS(props) {
  return (
    <Card className="reminders-panel">
        <Card.Header>OBS Integration</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col>
                        <Alert variant="success" className="obs-alert">OBS Authenticated Successfully.</Alert>
                    </Col>
                </Form.Row>
            </Form>
            <Form.Row className="obs-buttons">
                <Col>
                    <Button variant="primary" block>Reconnect to OBS</Button>
                </Col>
            </Form.Row>
        </Card.Body>
    </Card>
  );
}

export default OBS;