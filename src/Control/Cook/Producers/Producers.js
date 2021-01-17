import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import './producers.scss';

function Producers(props) {
  return (
    <Card className="producers-panel">
        <Card.Header>Remote Producers</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col>
                        <FormControl placeholder="Producer Usernames (Comma Seperated)" />
                    </Col>
                </Form.Row>
                <Form.Row className="producers-toggle">
                <Col xs={8} className="producers-toggle-label">Allow for all Subscribers</Col>
                <Col xs={4} className="producers-toggle-switch">
                    <BootstrapSwitchButton
                        checked={false}
                        size="md"
                        onstyle='primary'
                        offstyle="secondary"
                        onlabel="All Subs"
                        offlabel="Listed"
                    />
                </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <Button className="producers-button" variant="primary" block>Update Producers</Button>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Producers;