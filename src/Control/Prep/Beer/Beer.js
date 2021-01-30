// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// Include component stylings
import './beer.scss';

class Beer extends Component {
  constructor(props) {
    super(props);

    // Handle form inputs and toggle state.
    this.state = {
      beer: '',
      brewery: '',
      url: '',
      bubbles: 'stop'
    }

    this.handleBeer = this.handleBeer.bind(this);
    this.handleBrewery = this.handleBrewery.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.handleBubbles = this.handleBubbles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Listen for beer info updates.
    this.props.socket.on('drink-fetch', (msg) => {
      console.log('Beer.js | drink-fetch | Drink: ' + msg.beer + ' By: ' + msg.brewery);
      this.setState({
        beer: msg.beer,
        brewery: msg.brewery
      })
    })

    // Listen for bubbles state updates.
    this.props.socket.on('bubbles-state', (msg) => {
      console.log('Beer.js | bubbles-stage | Bubble State: ' + msg.state);
      this.setState({
        bubbles: msg.state
      })
    });
  }

  // Handle beer form inputs.
  handleBeer(event) {
    this.setState({ beer: event.target.value });
  }

  // Handle brewery form inputs.
  handleBrewery(event) {
    this.setState({ brewery: event.target.value });
  }

  // Handle URL form inputs.
  handleUrl(event) {
    this.setState({ url: event.target.value });
  }

  // Trigger bubble toggling.
  handleBubbles() {
    console.log('Beer.js | bubbles-toggle');
    this.props.socket.emit('bubbles-toggle');
  }

  // Submit drink information to the server.
  // TODO: Handle the URL field in a useful way.
  handleSubmit(hidden) {
    this.props.socket.emit('drink-update', {beer: this.state.beer, brewery: this.state.brewery, hidden: hidden}, (msg) => {
      this.setState({
        beer: msg.beer,
        brewery: msg.brewery,
      })
    });
  }

  render() {
    // Set the bubbles toggle button's state.
    // Note, the toggle gets distabled while the bubbles is in "stopping" mode.
    // A change is made to the BootstrapSwitchButton's 'key' field to deal with a toggle button bug.
    let bubblesChecked = false;
    if(this.state.bubbles === 'start') { bubblesChecked = true; }
    else if(this.state.bubbles === 'stopping') { bubblesChecked = false; }
    else if(this.state.bubbles === 'stop') { bubblesChecked = false; }

    return (
      <Card className="beer-panel">
        <Card.Header>Drink</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col>
                <FormControl placeholder="Beer" value={this.state.beer} onChange={this.handleBeer} />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <FormControl className="beer-form" placeholder="Brewery" value={this.state.brewery} onChange={this.handleBrewery} />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <FormControl className="beer-form" placeholder="URL" value={this.state.url} onChange={this.handleUrl} />
              </Col>
            </Form.Row>
            <Form.Row className="beer-buttons">
              <Col>
                <Button variant="primary" onClick={() => { this.handleSubmit(false) }} block>Show</Button>
              </Col>
              <Col>
                <Button variant="secondary" onClick={() => { this.handleSubmit(true) }} block>Hide</Button>
              </Col>
              <Col className="producers-toggle-switch">
                <BootstrapSwitchButton
                  checked={bubblesChecked}
                  size="md"
                  onstyle='primary'
                  offstyle="secondary"
                  onlabel="Bubbles"
                  offlabel="Bubbles"
                  disabled={(this.state.bubbles === 'stopping') ? true : false}
                  onChange={this.handleBubbles}
                  key={(this.state.bubbles === 'stopping') ? true : false}
                />
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Beer;