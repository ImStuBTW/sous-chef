import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Recipe from './Recipe/Recipe';
import Beer from './Beer/Beer';
import Reminders from './Reminders/Reminders';
import Triva from './Triva/Triva';

function Prep() {
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <Recipe />
        </Col>
        <Col md={6}>
          <Beer />
        </Col>
      </Row>
      <Row>
        <Col>
          <Reminders />
        </Col>
      </Row>
      <Row>
        <Col>
          <Triva />
        </Col>
      </Row>
    </Container>
  );
}

export default Prep;
