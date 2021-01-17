import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './probe.scss';

import stopIcon from '../../../Icons/stop.png';
import refreshIcon from '../../../Icons/arrows_counterclockwise.png';
import dontAwooIcon from '../../../Icons/dont_awoo.png';

function Probe(props) {
  return (
    <Card className="probe-panel">
        <Card.Header>
            <span>Probe Control</span>
            <Button className="probe-header-button" variant="primary" size="sm">
                <img className="probe-header-button-image" src={refreshIcon} alt="Refresh Probes" />
            </Button>
            <Button className="probe-header-button" variant="primary" size="sm">
                <img className="probe-header-button-image" src={stopIcon} alt="Stop Probe" />
            </Button>
        </Card.Header>
        <Card.Body>
        <Form>
            <Form.Row>
                <Col className="probe-port-list">
                    <Button className="probe-port-button" variant="primary" disabled>No Ports Available.</Button>
                </Col>
            </Form.Row>
            <Form.Row className="probe-target-row">
                <Col sm={2} className="probe-alarm">
                    <Button className="probe-alarm-button" variant="primary" block>
                        <span className="probe-alarm-icon">
                            <img className="probe-alarm-icon-image" src={dontAwooIcon} alt="Unmute" />
                        </span>
                        <span className="probe-alarm-text">
                            Alarm Disabled
                        </span>
                    </Button>
                </Col>
                <Col className="probe-target-input">
                    <InputGroup>
                        <FormControl placeholder="Target Temp" />
                        <InputGroup.Append>
                        <InputGroup.Text>°F</InputGroup.Text>
                        <Button variant="outline-primary">Set</Button>
                        <Button variant="outline-primary">Clear</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Form.Row>
            <Form.Row className="probe-readings">
                <Col>
                    <Alert className="probe-reading-alert" variant='secondary'>
                        <b>Latest Temp:</b> 76.2°F
                    </Alert>
                </Col>
                <Col>
                    <Alert className="probe-reading-alert" variant='secondary'>
                        <b>Target Temp:</b> 350°F
                    </Alert>
                </Col>
            </Form.Row>
            <Form.Row className="probe-controls">
                <Col>
                    <Button className="probe-control-button" variant="primary" block>Show Temp</Button>
                </Col>
                <Col>
                    <Button className="probe-control-button" variant="secondary" block>Hide Temp</Button>
                </Col>
            </Form.Row>
            <Form.Row className="probe-controls">
                <Col>
                    <Button className="probe-control-button" variant="primary" block>Show Chart</Button>
                </Col>
                <Col>
                    <Button className="probe-control-button" variant="secondary" block>Hide Chart</Button>
                </Col>
            </Form.Row>
        </Form>
        </Card.Body>
    </Card>
  );
}

export default Probe;