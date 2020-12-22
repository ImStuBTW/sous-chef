// Include the SerialPort packages.
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// The paths of Arduino serial ports on the system. Array of strings.
let paths = [];
// The specified Arduino port.
let port;
// The SerialPort paser to read incoming data.
let parser;

module.exports = function(io) {
    // Current probe module state.
    let tempHidden = false; // Should overlay be showing standalone temp panel?
    let chartHidden = false; // Should overlay be showing chart panel?
    let target = 'No Data'; // Target temperature. Should be 'No Data' or parsable number.
    let alarm = false; // Is the alarm activated?
    let alarmLogic = '<'; // Was the current temp less than or greater than target alarm was set?
    let lastTemp = 'No Data'; // Used to calculate alarmLogic.
    let alerted = false;

    // Function to emit current probe module state when new temperature is recieved.
    // Recieve 'data' string from SerialPort parser
    function emitTemps(data) {
        // Check and see if an alarm has gone off.
        if(data != 'No Data') {
            lastTemp = parseFloat(data);
            if(alarm && !alerted) {
                if(alarmLogic == '<') {
                    if(lastTemp > parseFloat(target)) {
                        alerted = true;
                        io.emit('probe-alert', {
                            alarm: alarm,
                            alerted: alerted
                        });
                    }
                }
                else {
                    if(lastTemp < parseFloat(target)) {
                        alerted = true;
                        io.emit('probe-alert', {
                            alarm: alarm,
                            alerted: alerted
                        });
                    }
                }
            }
        }
        // Emit probe state.
        io.emit('probe-temp', {
            temp: data, // String. 'No Data' or parsable number.
            target: target, // String. 'No Data' or parsable number.
            tempHidden: tempHidden, // true/false
            chartHidden: chartHidden, // true/false
            alarm: alarm, // true/false
        });
    }

    io.on('connection', (socket) => {
        // When 'probe-start' is recieved, initialize a new Probe.
        // Use when starting probe monitoring or switching ports.
        socket.on('probe-start', (msg) => {
            // Check and see if SerialPort has already been initiated.
            if(port) {
                // If the port's already initialized, check and see if it's been closed.
                // If closed, create a new instance on the updated path.
                if(!port.isOpen) {
                    // Create a new instance with the updated probe path.
                    port = new SerialPort(msg.path, { baudRate: 9600 }, (error) => {
                        if(error) { console.log(error); }
                    });
                    // Create a new data parser on the open port.
                    parser = port.pipe(new Readline());
                    // Send incoming temperature to the emitTemps function.
                    parser.on('data', emitTemps);
                }
            }
            else {
                // Create new SerialPort object and point it to the indicated path.
                port = new SerialPort(msg.path, { baudRate: 9600 }, (error) => {
                    console.log(error);
                });
                // Declare the Readline parser
                parser = port.pipe(new Readline());
                // Turn the pareser on.
                parser.on('data', emitTemps);
            }
        })

        // When 'probe-stop' is recieved, close any open probes.
        socket.on('probe-stop', () => {
            if(port.isOpen) {
                port.close();
            }
        })

        // When 'probe-target' is recieved, update the Target state.
        socket.on('probe-target', (msg) => {
            target = msg.target;
        })

        // When 'probe-display' is recieved, update the tempHidden state.
        socket.on('probe-display', (msg) => {
            tempHidden = msg.tempHidden;
        })

        // When 'probe-chart' is recieved, update the chartHidden state;
        socket.on('probe-chart', (msg) => {
            chartHidden = msg.chartHidden;
        })
        
        // When 'probe-alarm' is recieved, update the alarm and alarmLogic state;
        socket.on('probe-alarm', (msg) => {
            console.log('probe-alarm:' + msg.alarm);
            alarm = msg.alarm;
            if((target != 'No Data') && (lastTemp != 'No Data')) {
                if(parseFloat(lastTemp) < parseFloat(target)) {
                    alarmLogic = '<';
                }
                else {
                    alarmLogic = '>';
                }
            }
            // If the user is turning off the alarm while the alarm is on, tell the overlay to stop flashing.
            if((alerted && !alarm)) {
                alerted = false;
                io.emit('probe-alert', {
                    alarm: alarm,
                    alerted: alerted
                });
            }
        })

        // When 'probe-list' is recieved, return a list of avalible ports.
        // This is called when the control panel is first opened.
        // Can also be call through the refresh button.
        socket.on('probe-list', (fn) => {
            let ports = []
            SerialPort.list().then((list) => {
                paths = [];
                list.forEach((port) => {
                    paths.push(port.path);
                })
            }).then(() => {
                console.log(`Sending current probe path list: ${paths}`);
                fn(paths);
            });
        })
    });
};