let React = require('react');

let Panel = require("../Panel/Panel.jsx");

class ActiveTimer extends React.Component {    
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.timer.seconds === nextProps.timer.seconds) {
            return false;
        }

        return true;
    }

    // Show the timer details in a panel component.
	render() {
        if (!this.props.timer) {
            return null;
        }

		let child = null,
			minutes = Math.floor(this.props.timer.seconds / 60),
			seconds = this.props.timer.seconds - (minutes * 60),
			paddedSeconds = (seconds < 10) ? `0${seconds}` : seconds,
			panelProps = {
				title: this.props.timer.name,
				panelClass: 'panel-timer',
				contentClass: 'panel-timercontent',
				animate: true
			};

		if (this.props.timer.seconds === 0) {
            console.log('seconds equals 0');
			panelProps.content = 'DONE';
            panelProps.wrapperClass = 'panel-wrapper-timer-expired';
            panelProps.sound = 'http://localhost:3000/assets/whistle.mp3';
		}
		else {
			child = (<span>{minutes}<span className="panel-timercolon">:</span>{paddedSeconds}</span>);
		}

		return (<Panel {...panelProps}>{child}</Panel>);
	}
};

export default ActiveTimer;