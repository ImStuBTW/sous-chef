// Import React packages.
import { Component } from 'react';

// Import React-Bootstrap components.
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

// Import application components.
import TimerEntry from './TimerEntry';

// Import component stylings.
import './activeTimers.scss';

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
    // Listen for new timers.
    this.props.socket.on('timer-added', (msg) => {
      console.log('ActiveTimers.js | timer-added:');
      console.log(msg);
    });

    // Listen for expired timers.
    this.props.socket.on('timer-expired', (msg) => {
      console.log('ActiveTimers.js | timer-expired:');
      console.log(msg);
    });

    // Listen for restarted timers.
    this.props.socket.on('timer-restart', (msg) => {
      console.log('ActiveTimers.js | timer-restart:');
      console.log(msg);
    });

    // Listen for deleted timers.
    this.props.socket.on('timer-deleted', (msg) => {
      console.log('ActiveTimers.js | timer-deleted:');
      console.log(msg);
    });

    // Listen for all timers expired.
    this.props.socket.on('timer-empty', (msg) => {
      console.log('ActiveTimers.js | timer-empty:');
      console.log(msg);
      this.setState({ timers: emptyTimers });
    });

    // Once the listeners are set up, get the current status.
    this.props.socket.emit('timer-fetch', (msg) => {
      console.log('ActiveTimers.js | timer-fetch:');
      console.log(msg);
      this.setState({ timers: msg });
    });
  }

  render() {
    let renderedTimers = <ListGroup.Item>No Active Timers</ListGroup.Item>
    if(this.state.timers !== []) {
      renderedTimers = this.state.timers.map((timer) => {
        return <TimerEntry key={timer.id} name={timer.name} seconds={timer.seconds} />;
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