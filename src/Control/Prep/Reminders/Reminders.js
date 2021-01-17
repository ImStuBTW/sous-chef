import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import minusIcon from '../../../Icons/minus.png';
import plusIcon from '../../../Icons/plus.png';

import './reminders.scss';

function Reminders(props) {
  return (
    <Card className="reminders-panel">
        <Card.Header>Reminders Bot</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row className="reminders-toggle">
                    <Col xs={8} className="producers-toggle-label">Enable Reminders:</Col>
                    <Col xs={4} className="producers-toggle-switch">
                        <BootstrapSwitchButton
                            checked={false}
                            size="md"
                            onstyle='primary'
                            offstyle="secondary"
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <InputGroup className="reminders-interval">
                            <InputGroup.Prepend>
                            <InputGroup.Text>Interval:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl placeholder="Minutes" />
                            <InputGroup.Append>
                                <Button variant="primary">Update</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>                  
                        <Card className="reminder-list" style={{ width: '100%' }}>
                            <Card.Header>Current Reminders:</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Form.Row>
                                        <Col xs={10} className="reminder-text">What's your favorite Tex-Mex food?</Col>
                                        <Col xs={2}>
                                            <Button className="reminder-remove-button" variant="outline-primary" block>
                                                <img className="reminder-remove-icon" src={minusIcon} alt="Remove Message" />
                                            </Button>
                                        </Col>
                                    </Form.Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Row>
                                        <Col xs={10} className="reminder-form">
                                            <FormControl placeholder="New Reminder" />
                                        </Col>
                                        <Col xs={2}>
                                            <Button className="reminder-add-button" variant="primary" block>
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

export default Reminders;