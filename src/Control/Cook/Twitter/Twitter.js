// Import React packages.
import { Component } from 'react';

// Import Twitter packages.
import Tweet from 'react-tweet';
//import exampleTweet from './exampleTweet.json';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

// Import component styles.
import './twitter.scss';

class Twitter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      url: '',
      hidden: true,
      tweet: ''
    }

    this.handleTweet = this.handleTweet.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('tweet-info', (msg) => {
      console.log('Twitter.js | tweet-info');
      this.setState({
        url: msg.embed,
        hidden: msg.hidden,
        tweet: msg.tweet
      });
    });
  }

  handleFormChange(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleTweet(hidden) {
    this.props.socket.emit('tweet-update', {embed: this.state.url, hidden: hidden}, (msg) => {
      console.log('Twitter.js | tweet-update');
      this.setState({
        url: msg.embed,
        hidden: msg.hidden,
        tweet: msg.tweet
      });
    });
  };

  render() {
    let tweetPreview;

    if(this.state.tweet && this.state.tweet.errors) {
      tweetPreview = <Form.Row className="tweet-preview-col"><Col><Alert variant="warning">Tweet could not be retrived.</Alert></Col></Form.Row>
    }
    else if(this.state.tweet && !this.state.tweet.errors) {
      tweetPreview = <Form.Row className="tweet-preview-col">
                          <Col>
                              <div className="tweet-preview">
                                  <Tweet data={this.state.tweet} />
                              </div>
                          </Col>
                     </Form.Row>
    }

    return (
        <Card className="tweet-panel">
            <Card.Header>Show Tweet</Card.Header>
            <Card.Body>
                <Form>
                    {tweetPreview}
                    <Form.Row>
                        <Col className="tweet-form-group">
                            <Form.Row>
                                <Col>
                                    <FormControl placeholder="Tweet URL or ID" value={this.state.url} onChange={this.handleFormChange} />
                                </Col>
                            </Form.Row>
                            <Form.Row className="tweet-form-buttons">
                                <Col>
                                    <Button variant="primary" onClick={() => this.handleTweet(false)} block>Show Tweet</Button>
                                </Col>
                                <Col>
                                    <Button variant="secondary" onClick={() => this.handleTweet(true)} block>Hide Tweet</Button>
                                </Col>
                            </Form.Row>
                        </Col>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
    );
  }
}

export default Twitter;