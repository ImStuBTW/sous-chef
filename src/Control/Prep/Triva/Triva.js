import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import './triva.scss';

function Triva(props) {
  return (
    <Card className="triva-panel">
        <Card.Header>Triva Bot</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row className="triva-toggle">
                    <Col xs={8} className="producers-toggle-label">Enable Triva:</Col>
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
                        <InputGroup className="triva-interval">
                            <InputGroup.Prepend>
                            <InputGroup.Text>Triva Interval:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl placeholder="Minutes" />
                            <InputGroup.Append>
                                <Button variant="primary">Update</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Triva;