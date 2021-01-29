// Import React packages.
import { Component } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './probe.scss';

import stopIcon from '../../../Icons/stop.png';
import refreshIcon from '../../../Icons/arrows_counterclockwise.png';
import dontAwooIcon from '../../../Icons/dont_awoo.png';
import doAwooIcon from '../../../Icons/awoo.png';

class Probe extends Component {
	constructor(props) {
		super(props);

		this.state = {
			list: [],
			temp: 'No Data',
			target: 'No Data',
			setTarget: 'No Data',
			alarm: false,
			alerted: false,
			callbackStart: props.callbackStart
    };
    
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.list = this.list.bind(this);
    this.target = this.target.bind(this);
    this.showTemp = this.showTemp.bind(this);
    this.hideTemp = this.hideTemp.bind(this);
    this.showChart = this.showChart.bind(this);
    this.hideChart = this.hideChart.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
	}

	componentDidMount() {
		this.props.socket.emit('probe-list', (list) => {
			this.setState({	list: list });
		});

		this.props.socket.on('probe-temp', (msg) => {
			this.setState({
				temp: msg.temp,
				setTarget: msg.target,
				alarm: msg.alarm,
				alarmLogic: msg.alarmLogic
			});
		});

		this.props.socket.on('probe-alert', (msg) => {
			this.setState({
				alarm: msg.alarm,
				alerted: msg.alerted
			});
		})
	}

	start(path) {
		console.log(path);
		this.props.socket.emit('probe-start', {path: path});
	}

	stop() {
		this.props.socket.emit('probe-stop');
		this.setState({ temp: 'No Data' })
	}

	list() {
		this.props.socket.emit('probe-list', (list) => {
			this.setState({	list: list });
		});
	}

	target(target) {
    this.props.socket.emit('probe-target', {target: target});
    this.setState({setTarget: target});
	}

	showTemp() {
		this.props.socket.emit('probe-display', {tempHidden: true});
	}

	hideTemp() {
		this.props.socket.emit('probe-display', {tempHidden: false});
	}

	showChart() {
		this.props.socket.emit('probe-chart', {chartHidden: true});
	}

	hideChart() {
		this.props.socket.emit('probe-chart', {chartHidden: false});
	}

	setAlarm(alarmState) {
		this.props.socket.emit('probe-alarm', {alarm: alarmState});
		this.setState({alarm: alarmState});
	}

  render() {
    let portButtons = <Button className="probe-port-button" variant="primary" disabled>No Ports Available.</Button>

    if(this.state.list) {
      portButtons = this.state.list.slice(0).reverse().map(path => (
        <Button className="probe-port-button" variant="primary" key={path} onClick={(e) => { this.start(path) }}>{path}</Button>
      ))
    }

    return (
      <Card className="probe-panel">
        <Card.Header>
          <span>Probe Control</span>
          <Button className="probe-header-button" variant="primary" size="sm" onClick={this.list}>
            <img className="probe-header-button-image" src={refreshIcon} alt="Refresh Probes" />
          </Button>
          <Button className="probe-header-button" variant="primary" size="sm" onClick={this.stop}>
            <img className="probe-header-button-image" src={stopIcon} alt="Stop Probe" />
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Col className="probe-port-list">
                {portButtons}
              </Col>
            </Form.Row>
            <Form.Row className="probe-target-row">
              <Col sm={2} className="probe-alarm">
                { this.state.alarm === true ?
                  [ this.state.alerted ? 
                    <Button className="probe-alarm-button probe-alarm-button-expired" variant="primary" onClick={(e) => { this.setAlarm(false) }} block>
                      <span className="probe-alarm-icon"><img className="probe-alarm-icon-image" src={doAwooIcon} alt="Mute" /></span>
                      <span className="probe-alarm-text">Alarm Enabled</span>
                    </Button>
                    :
                    <Button className="probe-alarm-button" variant="primary" onClick={(e) => { this.setAlarm(false) }} block>
                      <span className="probe-alarm-icon"><img className="probe-alarm-icon-image" src={doAwooIcon} alt="Mute" /></span>
                      <span className="probe-alarm-text">Alarm Enabled</span>
                    </Button>
                  ]
                :
                  <Button className="probe-alarm-button" variant="primary" onClick={(e) => { this.setAlarm(true) }} block>
                    <span className="probe-alarm-icon"><img className="probe-alarm-icon-image" src={dontAwooIcon} alt="Unmute" /></span>
                    <span className="probe-alarm-text">Alarm Disabled</span>
                  </Button>
                }
              </Col>
              <Col className="probe-target-input">
                <InputGroup>
                  <FormControl placeholder="Target Temp" onChange={(e) => this.setState({ target: e.target.value })} />
                  <InputGroup.Append>
                    <InputGroup.Text>°F</InputGroup.Text>
                    <Button variant="outline-primary" onClick={(e) => { this.target(this.state.target) }}>Set</Button>
                    <Button variant="outline-primary" onClick={(e) => { this.target('No Data') }}>Clear</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Row>
            <Form.Row className="probe-readings">
              <Col>
                <Alert className="probe-reading-alert" variant='secondary'>
                  <b>Latest Temp:</b> {this.state.temp === 'No Data' ? 'No Data' : this.state.temp.slice(0, -2) + ' °F'}
                </Alert>
              </Col>
              <Col>
                <Alert className="probe-reading-alert" variant='secondary'>
                  <b>Target Temp:</b> {this.state.setTarget === 'No Data' ? 'No Target' : this.state.setTarget + ' °F'}
                </Alert>
              </Col>
            </Form.Row>
            <Form.Row className="probe-controls">
              <Col>
                <Button className="probe-control-button" variant="primary" onClick={this.showTemp} block>Show Temp</Button>
              </Col>
              <Col>
                <Button className="probe-control-button" variant="secondary" onClick={this.hideTemp} block>Hide Temp</Button>
              </Col>
            </Form.Row>
            <Form.Row className="probe-controls">
              <Col>
                <Button className="probe-control-button" variant="primary" onClick={this.showChart} block>Show Chart</Button>
              </Col>
              <Col>
                <Button className="probe-control-button" variant="secondary" onClick={this.hideChart} block>Hide Chart</Button>
              </Col>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default Probe;