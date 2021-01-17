import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Twitch from './Twitch/Twitch';
import OBS from './OBS/OBS';
import Info from './Info/Info';

function Config() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Twitch />
        </Col>
      </Row>
      <Row>
        <Col>
          <OBS />
        </Col>
      </Row>
      <Row>
        <Col>
          <Info />
        </Col>
      </Row>
    </Container>
  );
}

export default Config;
