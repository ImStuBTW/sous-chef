// Import React packages.
import { Component } from 'react';

// Styled-Components is required for styling ::before CSS for rotated backgrounds.
import styled from 'styled-components';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Include component stylings
import './image.scss';

// Create a styled div component.
// Props are passed from the Image component's render call.
// Rotates the image size and background if needed.
let Preview = styled.div`
  height: 100%;
  border-radius: 4px;
  ${(props) => {
    if(props.isHidden) {
      return `border: 2px dashed #6c757d`;
    }
    else if(props.rotate === 'none') {
      return `
        background-image: url('${props.url}');
        background-color: #6c757d;
        background-size: cover;
        background-position: center center;
      `;
    }
    else if(props.rotate === 'cw') {
      return `
        position: relative;
        overflow: hidden;
        &:before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          left: -50%;
          top: -50%;
          background-image: url('${props.url}');
          background-color: #6c757d;
          background-size: cover;
          background-position: center center;
          transform: rotate(90deg);
        }
      `;
    }
    else if(props.rotate === 'flip') {
      return `
      position: relative;
      overflow: hidden;
      &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url('${props.url}');
        background-color: #6c757d;
        background-size: cover;
        background-position: center center;
        transform: rotate(180deg);
      }
      `;
    }
    else if(props.rotate === 'ccw') {
      return `
      position: relative;
      overflow: hidden;
      &:before {
        content: "";
        position: absolute;
        width: 200%;
        height: 200%;
        left: -50%;
        top: -50%;
        background-image: url('${props.url}');
        background-color: #6c757d;
        background-size: cover;
        background-position: center center;
        transform: rotate(-90deg);
      }
      `;
    }
  }}
`;

class Images extends Component {
  constructor(props) {
    super(props);
    
    // Store URL field, as well as any image updates from the server.
    this.state = {
      url: '',
      serverUrl: '',
      serverHidden: true,
      serverRotate: 'none'
    }

    this.handleImage = this.handleImage.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  
  componentDidMount() {
    // Update control panel to show latest image from server.
    this.props.socket.on('image-info', (msg) => {
      this.setState({
        url: msg.url,
        serverUrl: msg.url,
        serverHidden: msg.hidden,
        serverRotate: msg.rotate
      });
    });

    // When component mounts, get the latest image info from the server.
    this.props.socket.emit('image-fetch', (msg) => {
      if(msg.url !== '' && msg.hidden !== true) {
        console.log('Image.js | image-fetch | Recieving image: ');
        console.log(msg);
      }

      this.setState({
        serverUrl: msg.url,
        serverHidden: msg.hidden,
        serverRotate: msg.rotate
      });
    });
  }

  // Submit current url field to server to display.
  handleImage(hidden, rotate) {
    this.props.socket.emit('image-update', {
      url: this.state.url,
      rotate: rotate,
      hidden: hidden
    });
  }

  // Handle updates to URL field.
  handleFormChange(event) {
    this.setState({
      url: event.target.value
    });
  }

  // Sends URL to display an image on the overlay.
  // Supports the option to rotate the image if needed.
  // (OBS's browser renderer does not support metadata image rotation.)
  // Shows a small preview of the currently displayed image.
  render() {
    return (
      <Card className="image-panel">
        <Card.Header>Show Image</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col sm={2} className="image-preview-col">
                <Preview url={this.state.serverUrl} isHidden={this.state.serverHidden} rotate={this.state.serverRotate}></Preview>
              </Col>
              <Col sm={10} xs={12} className="image-form-group">
                <Form.Row className="mb-2">
                  <Col>
                    <FormControl placeholder="Image URL" value={this.state.url} onChange={this.handleFormChange} />
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>Rotate:</InputGroup.Text>
                      </InputGroup.Prepend>
                      <InputGroup.Append className="image-rotate-button">
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'none')} className="image-rotate-button">0°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'cw')} className="image-rotate-button">90°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'flip')} className="image-rotate-button">180°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'ccw')} className="image-rotate-button">270°</Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Col>
                </Form.Row>
                <Form.Row className="image-form-buttons">
                  <Col>
                    <Button variant="primary" onClick={() => this.handleImage(false, 'none')} block>Show Image</Button>
                  </Col>
                  <Col>
                    <Button variant="secondary" onClick={() => this.handleImage(true, 'none')} block>Hide Image</Button>
                  </Col>
                </Form.Row>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    )
  };
}

export default Images;