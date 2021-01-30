// Import react-bootstrap components.
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

// Include icons
import minusIcon from '../../../Icons/minus.png';

// Include component stylings
import './reminderEntry.scss';

function ReminderEntry(props) {
  return (
    <ListGroup.Item>
      <Form.Row>
        <Col xs={10} className="reminder-text">{props.message}</Col>
        <Col xs={2}>
          <Button className="reminder-remove-button" variant="outline-primary" onClick={() => { props.deleteCallback(props.messageId) }} block>
            <img className="reminder-remove-icon" src={minusIcon} alt="Remove Message" />
          </Button>
        </Col>
      </Form.Row>
    </ListGroup.Item>
  );
}

export default ReminderEntry;