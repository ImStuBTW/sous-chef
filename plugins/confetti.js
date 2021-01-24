module.exports = function(io, clientSocket) {
    // Current confetti state.
    // Availble Options: Start, Stopping, Stop
    let confetti = {state: 'stop'};

    // Start confetti if confetti is stopped.
    // Do nothing if confetti is stopping.
    // Stop confetti if confetti is running.
    clientSocket.on('confetti-toggle', () => {
        if(confetti.state === 'start') {
            console.log('confetti.js | confetti-toggle | Stopping confetti.');
            confetti.state = 'stopping';
            io.emit('confetti-state', confetti);
        }
        else if(confetti.state === 'stop') {
            console.log('confetti.js | confetti-toggle |  Starting confetti');
            confetti.state = 'start';
            io.emit('confetti-state', confetti);
        }
    });

    io.on('connection', (socket) => {
        // FETCH CONFETTI
        socket.on('confetti-fetch', (fn) => {
            console.log(`confetti.js | confetti-fetch | Sending current confetti state: ${confetti.state}`);
            fn(confetti);
        });

        // UPDATE CONFETTI
        socket.on('confetti-update', (msg) => {
            console.log(`confetti.js | confetti-update | Confetti state: ${msg.state}`);
            confetti = msg;
            io.emit('confetti-state', msg);
        });

        // TOGGLE CONFETTI
        socket.on('confetti-toggle', (msg) => {
            if(confetti.state === 'start') {
                console.log('confetti.js | confetti-toggle | Stopping confetti.');
                confetti.state = 'stopping';
                io.emit('confetti-state', confetti);
            }
            else if(confetti.state === 'stop') {
                console.log('confetti.js | confetti-toggle | Starting confetti.');
                confetti.state = 'start';
                io.emit('confetti-state', confetti);
            }
        });
    });
};