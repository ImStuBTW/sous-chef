// Import React packages.
import { Component } from 'react';
import Timer from 'react-compound-timer';

// Import React-Bootstrap components.
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

// Import component stylings.
import './timerEntry.scss';

// Import icons.
import stopIcon from '../../../Icons/stop.png';
import refreshIcon from '../../../Icons/arrows_counterclockwise.png';

class TimerEntry extends Component {
  constructor(props) {
    super(props);

    // initTime is passed via props. Should be amount of time remaining from server.
    // 'timer-entry-standard' is standard style. 'timer-entry-flashing' is for expired timers.
    this.state = {
      initTime: parseInt(this.props.seconds)*1000,
      styleName: 'timer-entry-standard'
    }

    this.handleRepeat = this.handleRepeat.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  // If the timer's already expired when the component load, make it flash.
  componentDidMount() {
    if(this.state.initTime === 0) {
      this.setState({styleName: 'timer-entry-flashing'});
    }
  }

  // Tell the server to repeat the timer.
  // 'timer-restart' will emit and get caught by TimerList.js
  // New initTime will be set with restarted time total.
  // Style is reset back to standard.
  handleRepeat() {
    console.log('TimerEntry.js | timer-repeat | Repeating Timer: ' + this.props.name);
    this.props.socket.emit('timer-repeat', {id: this.props.id, name: this.props.name, seconds: this.props.seconds});
    this.setState({
      initTime: parseInt(this.props.seconds)*1000,
      styleName: 'timer-entry-standard'
    })
  }

  // Tell the server to delete the timer.
  handleDelete() {
    console.log('TimerEntry.js | timer-delete | Deleting Timer: ' + this.props.name);
    this.props.socket.emit('timer-delete', {id: this.props.id, name: this.props.name, seconds: this.props.seconds});
  }

  // Render the timer using the react-compound-timer component.
  // Checkpoint callback sets the timer to expired when time reaches zero.
  // Buttons can be used to restart or delete timer.
  render() {
    return (
      <ListGroup.Item className={this.state.styleName}>
        <Form.Row>
          <Timer
              initialTime={this.state.initTime}
              direction="backward"
              timeToUpdate={500}
              checkpoints={[{
                time: 0,
                callback: () => {
                  this.setState({
                    styleName: 'timer-entry-flashing'
                  })
                }
              }]}
          >
          {({start, resume, pause, stop, reset, timerState}) => (<>
            <Col className="timer-entry-text" xs={2} style={{textAlign: 'center'}}><Timer.Minutes />:<Timer.Seconds formatValue={(text) => (text.toString().length > 1 ? text : "0" + text)} /></Col>
            <Col className="timer-entry-text">{this.props.name}</Col>
            <Col xs={2}><Button className="timer-entry-button" variant="secondary" onClick={() => { this.handleRepeat(); reset(); start(); }} block><img className="timer-entry-button-image" src={refreshIcon} alt="Repeat" /></Button></Col>
            <Col xs={2}><Button className="timer-entry-button" variant="danger" onClick={this.handleDelete} block><img className="timer-entry-button-image" src={stopIcon} alt="Delete" /></Button></Col>
          </>)}
          </Timer>
        </Form.Row>
      </ListGroup.Item>
  )};
}

export default TimerEntry;