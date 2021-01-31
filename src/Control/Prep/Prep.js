// Import React packages.
import { Component } from 'react';

// Include React-Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Include app componnets
import Recipe from './Recipe/Recipe';
import Beer from './Beer/Beer';
import Reminders from './Reminders/Reminders';
import Trivia from './Trivia/Trivia';

class Prep extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={6}>
            <Recipe socket={this.props.socket} />
          </Col>
          <Col md={6}>
            <Beer socket={this.props.socket} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Reminders socket={this.props.socket} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Trivia socket={this.props.socket} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Prep;
