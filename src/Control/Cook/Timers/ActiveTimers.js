import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import './activeTimers.scss';

function ActiveTimers(props) {
  return (
    <Card className="timers-list">
        <Card.Header>Active Timers</Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item>No Active Timers</ListGroup.Item>
        </ListGroup>
    </Card>
  );
}

export default ActiveTimers;