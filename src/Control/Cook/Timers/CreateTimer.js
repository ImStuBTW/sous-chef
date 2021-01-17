import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './createTimer.scss';

function CreateTimer(props) {
  return (
    <Card className="timers-create">
        <Card.Header>New Timer</Card.Header>
        <Card.Body>
        <Form>
            <Form.Group controlId="formTimerName" >
                <Form.Control placeholder="Timer Name"></Form.Control>
            </Form.Group>
            <Form.Row>
                <Col>
                    <Form.Group className="timer-form-group" controlId="formTimerMinutes" >
                        <Form.Control placeholder="Minutes"></Form.Control>
                    </Form.Group>
                </Col>
                <div className="timer-colon">:</div>
                <Col>
                    <Form.Group className="timer-form-group" controlId="formTimerSeconds" >
                        <Form.Control placeholder="Seconds"></Form.Control>
                    </Form.Group>
                </Col>
            </Form.Row>
            <Form.Row className="timer-quick-buttons">
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>1:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>2:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>3:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>4:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>5:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>10:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>15:00</Button></Col>
                <Col><Button className="timer-button" variant="outline-primary" size="sm" block>30:00</Button></Col>
            </Form.Row>
            <Button className="timer-button" variant="primary" block>Submit</Button>
        </Form>
        </Card.Body>
    </Card>
  );
}

export default CreateTimer;