const StreamTimer = require('../utils/StreamTimer.js');
const TimerUtil = require('../utils/timerutil.js');

module.exports = function(io) {
    let streamTimers = [];

    io.on('connection', (socket) => {
        // GET TIMERS
        // This message occurs when the timer state is requested on the control panel.
        // Broadcast recipe details to all listeners.
        socket.on('timer-fetch', function(fn) {
            let timerJson = JSON.stringify(streamTimers);
            console.log(`timer.js | timer-fetch | Sending timers '${timerJson}'.`);
            fn(streamTimers.map(TimerUtil.extractTimerInfo));
        });

        // NEW TIMER
        // This message is sent by the control page when a new timer is created.
        // Keep track of the timer on the server, then broadcast the new timer
        // info to all listeners.
        socket.on('timer-new', function(msg) {
            console.log(`timer.js | timer-new | New timer named '${msg.name}' w/${msg.seconds}secs`);

            // Callback that updates the timer state every second.
            let updateSeconds = (id, name, seconds, event) => {
                // When timer runs out, broadcast its expiration to listeners.
                if (seconds === 0) {
                    console.log(`Timer '${name}' is done.`);
                    //stopTimer();
                    io.emit('timer-expired', msg);
                }
            };

            let targetAchieved = (id) => {
                console.log(`timer.js | Timer '${msg.name}' is done.`);
                io.emit('timer-expired', msg);
            };
            
            streamTimers.push(new StreamTimer(msg.id, msg.name, msg.seconds, null, targetAchieved));
            
            io.emit('timer-added', msg);
        });

        // REPEAT TIMER
        // Listen for when a timer needs to be repeated.
        // Trigger the repeat on the server, then broadcast the repeat
        // info to all listeners.
        socket.on('timer-repeat', function(msg) {
            console.log(`timer.js | timer-repeat | Repeating timer '${msg.name}'.`);

            let index = TimerUtil.getTimerIndexWithId(streamTimers, msg.id);
            if (index >= 0) {
                streamTimers[index].repeatTimer();
            }

            io.emit('timer-restart', msg);
        });

        // DELETE TIMER
        // This message is sent when a timer is deleted on the control page.
        // A timer can be deleted while in progress or after reaching 0.
        // Broadcast the deletion to all listeners once we remove it from the server.
        socket.on('timer-delete', function(msg) {
            console.log(`timer.js | timer-delete | Deleting timer '${msg.name}' w/${msg.seconds}secs remaining`);

            let index = TimerUtil.getTimerIndexWithId(streamTimers, msg.id);
            if (index >= 0) {
                streamTimers[index].disposeTimer();
                streamTimers.splice(index, 1);
            }

            io.emit('timer-deleted', msg);

            if (streamTimers.length === 0) {
                console.log('timer.js | No timers left, emitting event \'timer-empty\'.');
                io.emit('timer-empty', {timers: 0});
            }    
        });
    });
};