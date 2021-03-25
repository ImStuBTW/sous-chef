// Import Javascript packages.
import uuid from 'uuid';

// Import React packages.
import { Component } from 'react';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Include component stylings
import './createTimer.scss';

class CreateTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      minutes: '',
      seconds: ''
    }

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleTimeButton = this.handleTimeButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleFormChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleTimeButton(minutes) {
    this.setState({
      minutes: minutes,
      seconds: '00'
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const newName = ((this.state.name) ? this.state.name : 'Timer McTimerface');
    let totalSeconds = 0;
    if(parseInt(this.state.minutes)) { totalSeconds += (parseInt(this.state.minutes)*60); }
    if(parseInt(this.state.seconds)) { totalSeconds += parseInt(this.state.seconds); }
    this.props.socket.emit('timer-new', {
      id: uuid(),
      name: newName,
      seconds: totalSeconds
    });
    this.setState({
      name: '',
      minutes: '',
      seconds: ''
    })
  }

  render() {
    return (
      <Card className="timers-create">
        <Card.Header>New Timer</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formTimerName" >
              <Form.Control placeholder="Timer Name" value={this.state.name} name="name" onChange={this.handleFormChange}></Form.Control>
            </Form.Group>
            <Form.Row>
              <Col>
                <Form.Group className="timer-form-group" controlId="formTimerMinutes" >
                  <Form.Control placeholder="Minutes" value={this.state.minutes} name="minutes" type="number" onChange={this.handleFormChange}></Form.Control>
                </Form.Group>
              </Col>
              <div className="timer-colon">:</div>
              <Col>
                <Form.Group className="timer-form-group" controlId="formTimerSeconds" >
                  <Form.Control placeholder="Seconds" value={this.state.seconds} name="seconds" type="number" onChange={this.handleFormChange}></Form.Control>
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row className="timer-quick-buttons">
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('1')}>1:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('2')}>2:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('3')}>3:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('4')}>4:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('5')}>5:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('10')}>10:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('15')}>15:00</Button></Col>
              <Col><Button className="timer-button" variant="outline-primary" size="sm" block onClick={() => this.handleTimeButton('30')}>30:00</Button></Col>
            </Form.Row>
            <Button className="timer-button" variant="primary" block onClick={this.handleSubmit}>Create Timer</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  };
}

export default CreateTimer;