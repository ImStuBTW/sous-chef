import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './image.scss';

function Images(props) {
  return (
    <Card className="image-panel">
        <Card.Header>Show Image</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col sm={2} className="image-preview-col">
                        <div className="image-preview image-preview-border"></div>
                    </Col>
                    <Col sm={10} xs={12} className="image-form-group">
                        <Form.Row>
                            <Col>
                                <InputGroup>
                                    <FormControl placeholder="Image URL" />
                                    <InputGroup.Append>
                                    <Button variant="outline-primary">0°</Button>
                                    <Button variant="outline-primary">90°</Button>
                                    <Button variant="outline-primary">180°</Button>
                                    <Button variant="outline-primary">270°</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Form.Row>
                        <Form.Row className="image-form-buttons">
                            <Col>
                                <Button variant="primary" block>Show Image</Button>
                            </Col>
                            <Col>
                                <Button variant="secondary" block>Hide Image</Button>
                            </Col>
                        </Form.Row>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Images;