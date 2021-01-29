// Import React packages.
import { Component } from 'react';
import styled from 'styled-components';

// Import react-bootstrap components.
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './image.scss';


let Preview = styled.div`
  height: 100%;
  border-radius: 4px;
  ${(props) => {
    console.log(props);
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
          height: 100%;
          left: -50%;
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
        height: 100%;
        left: -50%;
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

//       background-image: url(${props.serverUrl});

class Images extends Component {
  constructor(props) {
    super(props);
    
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
    this.props.socket.on('image-info', (msg) => {
      this.setState({
        serverUrl: msg.url,
        serverHidden: msg.hidden,
        serverRotate: msg.rotate
      })
    });

    this.props.socket.emit('image-fetch', (msg) => {
      console.log('Image.js | image-fetch | Recieving image: ');
      console.log(msg);
        this.setState({
          serverUrl: msg.url,
          serverHidden: msg.hidden,
          serverRotate: msg.rotate
        });
    })
  }

  handleImage(hidden, rotate) {
    this.props.socket.emit('image-update', {
      url: this.state.url,
      rotate: rotate,
      hidden: hidden
    });
  }

  handleFormChange(event) {
    this.setState({
      url: event.target.value
    });
  }

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
                <Form.Row>
                  <Col>
                    <InputGroup>
                      <FormControl placeholder="Image URL" value={this.state.url} onChange={this.handleFormChange} />
                      <InputGroup.Append>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'none')}>0°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'cw')}>90°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'flip')}>180°</Button>
                        <Button variant="outline-primary" onClick={() => this.handleImage(false, 'ccw')}>270°</Button>
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
  } Yeah;
}

export default Images;