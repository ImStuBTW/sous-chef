import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import './beer.scss';

function Beer(props) {
  return (
    <Card className="beer-panel">
        <Card.Header>Recipe</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col>
                        <FormControl placeholder="Beer" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <FormControl className="beer-form" placeholder="Brewery" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <FormControl className="beer-form" placeholder="URL" />
                    </Col>
                </Form.Row>
                <Form.Row className="beer-buttons">
                    <Col>
                        <Button variant="primary" block>Show</Button>
                    </Col>
                    <Col>
                        <Button variant="secondary" block>Hide</Button>
                    </Col>
                    <Col className="producers-toggle-switch">
                        <BootstrapSwitchButton
                            checked={false}
                            size="md"
                            onstyle='primary'
                            offstyle="secondary"
                            onlabel="Bubbles"
                            offlabel="Bubbles"
                        />
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Beer;