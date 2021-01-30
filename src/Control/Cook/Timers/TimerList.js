// Import React packages.
import { Component } from 'react';

// Import React-Bootstrap components.
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

// Import application components.
import TimerEntry from './TimerEntry';

// Import component stylings.
import './timerList.scss';

// Initialize the current list of timers as an empty array.
const emptyTimers = [];

class ActiveTimers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: emptyTimers
    }
  }

  componentDidMount() {
    // Listen for new timers. Update state to include timer.
    this.props.socket.on('timer-added', (msg) => {
      console.log('TimerList.js | timer-added:');
      console.log(msg);
      this.setState({timers: [...this.state.timers, msg]})
    });

    // Listen for expired timers.
    // Update timers list with the timer that has reached 0 in case UI has not caught up yet.
    this.props.socket.on('timer-expired', (msg) => {
      console.log('Timerlist.js | timer-expired:');
      console.log(msg);
      this.setState({
        timers: this.state.timers.map((timer) => {
          if(timer.id === msg.id) {
            return msg;
          }
          else {
            return timer;
          }
        })
      });
    });

    // Listen for restarted timers.
    // Replace current timer time with restarted value from server.
    this.props.socket.on('timer-restart', (msg) => {
      console.log('TimerList.js | timer-restart:');
      console.log(msg);
      this.setState({
        timers: this.state.timers.map((timer) => {
          if(timer.id === msg.id) {
            return msg;
          }
          else {
            return timer;
          }
        })
      });
    });

    // Listen for deleted timers.
    // Remove deleted timers from list.
    this.props.socket.on('timer-deleted', (msg) => {
      console.log('TimerList.js | timer-deleted:');
      console.log(msg);
      this.setState({timers: this.state.timers.filter((timer) => {
        return timer.id !== msg.id;
      })});
    });

    // Listen for all timers expired. (Fallback in case timer list has gotten out of date.)
    // If 'timer-empty' is triggered, set timer list to empty array.
    this.props.socket.on('timer-empty', (msg) => {
      console.log('TimerList.js | timer-empty:');
      console.log(msg);
      this.setState({ timers: emptyTimers });
    });

    // Once the listeners are set up, get the current status.
    this.props.socket.emit('timer-fetch', (msg) => {
      if(msg.length !== 0) {
        console.log('TimerList.js | timer-fetch:');
        console.log(msg);
      }
      this.setState({ timers: msg });
    });
  }

  // Render the list of timers.
  // TimerEntry's key is a combination of timer.id and timer.seconds.
  // This causes the TimerEntry component to re-render and properly update the remaining time for 'timer-restart'.
  render() {
    let renderedTimers = <ListGroup.Item>No Active Timers</ListGroup.Item>;
    if(this.state.timers.length !== 0) {
      renderedTimers = this.state.timers.map((timer) => {
        return <TimerEntry key={timer.id + '-' + timer.seconds} id={timer.id} name={timer.name} seconds={timer.seconds} socket={this.props.socket} />;
      });
    }

    return (
      <Card className="timers-list">
        <Card.Header>Active Timers</Card.Header>
        <ListGroup variant="flush">
          { renderedTimers }
        </ListGroup>
      </Card>
  )};
}

export default ActiveTimers;