import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import './recipe.scss';

function Recipe(props) {
  return (
    <Card className="recipe-panel">
        <Card.Header>Recipe</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row>
                    <Col>
                        <FormControl placeholder="Title" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <FormControl className="recipe-form" placeholder="Subtitle" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <FormControl className="recipe-form" placeholder="URL" />
                    </Col>
                </Form.Row>
                <Form.Row className="recipe-buttons">
                    <Col>
                        <Button variant="primary" block>Show Recipe</Button>
                    </Col>
                    <Col>
                        <Button variant="secondary" block>Hide Recipe</Button>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Recipe;