import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Tweet from 'react-tweet';
import exampleTweet from './exampleTweet.json';

import './twitter.scss';

function Twitter(props) {
  return (
    <Card className="tweet-panel">
        <Card.Header>Show Tweet</Card.Header>
        <Card.Body>
            <Form>
                <Form.Row className="tweet-preview-col">
                    <Col>
                        <div className="tweet-preview">
                            <Tweet data={exampleTweet} />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col className="tweet-form-group">
                        <Form.Row>
                            <Col>
                                <FormControl placeholder="Tweet URL or ID" />
                            </Col>
                        </Form.Row>
                        <Form.Row className="tweet-form-buttons">
                            <Col>
                                <Button variant="primary" block>Show Tweet</Button>
                            </Col>
                            <Col>
                                <Button variant="secondary" block>Hide Tweet</Button>
                            </Col>
                        </Form.Row>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>
    </Card>
  );
}

export default Twitter;