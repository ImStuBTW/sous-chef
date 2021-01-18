import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import './info.scss';

function Info(props) {
    return (
        <Card className="info-panel">
            <Card.Header>Sous Chef Information</Card.Header>
            <Card.Body className="info-panel-body">
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Homepage (Bonjour)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://souschef.local/">http://souschef.local/</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Homepage (LAN)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://192.168.32.78/">http://192.168.32.78/</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Homepage (Localhost)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://localhost/">http://localhost/</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Overlay (Bonjour)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://souschef.local/overlay">http://souschef.local/overlay</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Overlay (LAN)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://192.168.32.78/overlay">http://192.168.32.78/overlay</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Row>
                            <Col xs={6} className="info-page">Overlay (Localhost)</Col>
                            <Col xs={6} className="info-url"><a target="_blank" rel="noreferrer" href="http://localhost/overlay">http://localhost/overlay</a></Col>
                        </Form.Row>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default Info;