import React from 'react';

import StreamTimer from './StreamTimer';
import TimerUtil from './timerutil.js';

class TimerControlContainer extends React.Component {
    constructor(props) {
        super(props);

        // Keep track of timers in this container
        this.streamTimers = [];

        // NEW TIMER
        // Listen for new timer events so that we can add it to this container.
        this.props.socket.on('timer-added', (msg) => {
            let newTimer = this.createNewTimer(msg);
            this.streamTimers.push(newTimer);

            let timers = this.state.timers;
            timers = timers.concat(TimerUtil.extractTimerInfo(newTimer));
            this.setState({timers: timers});
        });

        // EXPIRED TIMER
        // Listen for when a timer runs out so we can turn it off. 
        // Strictly speaking this isn't necessary since we have
        // our own timer here, but the server is the source of truth, 
        // so we defer to its data.
        this.props.socket.on('timer-expired', (msg) => {
            let index = TimerUtil.getTimerIndexWithId(this.streamTimers, msg.id);

            if (index >= 0) {
                this.streamTimers[index].stopTimer();
            }

            this.setState({
                timers: this.streamTimers.map((timer, curr) => {
                    let stateTimer = TimerUtil.extractTimerInfo(timer);
                    if (curr === index) { stateTimer.seconds = 0; }
                    return stateTimer;
                })
            });
        });

        // REPEAT TIMER
        // Listen for when a timer needs to be repeated.
        this.props.socket.on('timer-restart', (msg) => {
            let index = TimerUtil.getTimerIndexWithId(this.streamTimers, msg.id);

            if (index >= 0) {
                this.streamTimers[index].repeatTimer();
            }
        })

        // DELETE TIMER
        // Listen for when a timer is deleted from the control page.
        // A timer can be deleted while in progress or after reaching 0.
        this.props.socket.on('timer-deleted', (msg) => {
            let index = TimerUtil.getTimerIndexWithId(this.streamTimers, msg.id);

            if (index >= 0) {
                // Dispose stops the timer and unhooks event listeners.
                this.streamTimers[index].disposeTimer();
                this.streamTimers.splice(index, 1);
            }

            this.setState({timers: this.streamTimers.map(TimerUtil.extractTimerInfo)});
        });

        // Initialize our timers array from props, if any exist.
        if (props.timers) {
            let newTimers = props.timers.map((timer) => {
                return this.createNewTimer(timer);
            });

            this.streamTimers = newTimers;
        }

        // Establish state.
        // Child timers don't need the full StreamTimer object, so
        // we extract pertinent info before setting state.
        this.state = {
            timers: this.streamTimers.map((timer) => {return TimerUtil.extractTimerInfo(timer)})
        };
    }

    // Create a new timer for this container.
    createNewTimer(msg) {
        // Callback that updates the timer state every second.
        function updateSeconds(id, name, seconds, event) {
            let timers = this.streamTimers.map(TimerUtil.extractTimerInfo);

            this.setState({timers: timers});
        };
        
        return new StreamTimer(msg.id, msg.name, msg.seconds, updateSeconds);
    }

    // Callback to trigger timer deletion.
    // If the child component supports deleting timers, it will use this function.
    // We don't actually do any deleting here, we just let the server know and
    // wait for the global broadcast (see above).
    deleteTimer(timer) {
        this.props.socket.emit('timer-delete', timer);
    }

    // Callback to trigger a timer repeat.
    // If the child component supports repeating timers, it will use this function.
    // We don't manipulate the timer here, we just let the server know and
    // wait for the global broadcast (see above).
    repeatTimer(timer) {
        this.props.socket.emit('timer-repeat', timer);
    }

    // Render the timers in this container.
    render() {
        // Display a message if there are no timers.
        if (this.state.timers.length === 0) {
            // Only show a message if requested in props, otherwise render nothing.
            if (this.props.showNone) { 
                return (<h5>No Timers Set</h5>); 
            }

            return null;
        }
        else {
            // Render each timer using the component passed in via props.
            let Component = this.props.component;
            return this.state.timers.map((timer) => {
                return (<Component key={timer.id} timer={timer} 
                    onDelete={this.deleteTimer.bind(this)}
                    onRepeat={this.repeatTimer.bind(this)} 
                />);
            });
        }
    }
};

export default TimerControlContainer;