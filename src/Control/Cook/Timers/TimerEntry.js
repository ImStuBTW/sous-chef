// Import React packages.
import { Component } from 'react';

// Import React-Bootstrap components.
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

// Import component stylings.
import './timerEntry.scss';

class TimerEntry extends Component {
  render() {
    let minutes = Math.floor(this.props.seconds/60);
    let seconds = this.props.seconds - Math.floor(this.props.seconds/60)*60;

    if(seconds === 0) { seconds = '00'; }

    return (
      <ListGroup.Item>
        <Form.Row>
          <Col xs={1}>{minutes}:{seconds}</Col>
          <Col>{this.props.name}</Col>
          <Col xs={2}><Button block>Repeat</Button></Col>
          <Col xs={2}><Button block>Delete</Button></Col>
        </Form.Row>
      </ListGroup.Item>
  )};
}

export default TimerEntry;