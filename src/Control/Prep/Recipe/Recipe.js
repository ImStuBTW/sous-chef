// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

// Include component stylings
import './recipe.scss';

class Recipe extends Component {
  constructor(props) {
    super(props);

    // Handle form inputs and toggle state.
    this.state = {
      title: '',
      subtitle: '',
      url: '',
    }

    this.handleTitle = this.handleTitle.bind(this);
    this.handleSubtitle = this.handleSubtitle.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Listen for recipe info updates.
    this.props.socket.on('recipe-info', (msg) => {
      console.log('Recipe.js | recipe-info | Recipe: ' + msg.title + ' ' + msg.subtitle);
      this.setState({
        title: msg.title,
        subtitle: msg.subtitle
      });
    });

    // When component mounts, get the latest recipe info from the server.
    this.props.socket.emit('recipe-fetch', (msg) => {
      if(msg.title !== '') {
        console.log('Recipe.js | recipe-fetch | Recipe: ' + msg.title + ' ' + msg.subtitle);
      }

      this.setState({
        title: msg.title,
        subtitle: msg.subtitle
      });
    });      
  }

  // Handle title form inputs.
  handleTitle(event) {
    this.setState({ title: event.target.value });
  }

  // Handle subtitle form inputs.
  handleSubtitle(event) {
    this.setState({ subtitle: event.target.value });
  }

  // Handle URL form inputs.
  handleUrl(event) {
    this.setState({ url: event.target.value });
  }

  // Submit drink information to the server.
  // TODO: Handle the URL field in a useful way.
  handleSubmit(hidden) {
    this.props.socket.emit('recipe-update', {title: this.state.title, subtitle: this.state.subtitle, hidden: hidden}, (msg) => {
      this.setState({
        title: msg.title,
        subtitle: msg.subtitle,
      })
    });
  }

  render() {
    return (
      <Card className="recipe-panel">
        <Card.Header>Recipe</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                <FormControl placeholder="Title" value={this.state.title} onChange={this.handleTitle} />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <FormControl className="recipe-form" placeholder="Subtitle" value={this.state.subtitle} onChange={this.handleSubtitle} />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <FormControl className="recipe-form" placeholder="URL" value={this.state.url} onChange={this.handleUrl} />
              </Col>
            </Form.Row>
            <Form.Row className="recipe-buttons">
              <Col>
                <Button variant="primary" onClick={() => { this.handleSubmit(false) }} block>Show Recipe</Button>
              </Col>
              <Col>
                <Button variant="secondary" onClick={() => { this.handleSubmit(true) }} block>Hide Recipe</Button>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Recipe;