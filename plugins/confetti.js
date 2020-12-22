module.exports = function(io, clientSocket) {
    // Current confetti state.
    // Availble Options: Start, Stopping, Stop
    let confetti = {state: 'stop'};

    // Start confetti if confetti is stopped.
    // Do nothing if confetti is stopping.
    // Stop confetti if confetti is running.
    clientSocket.on('confetti-toggle', () => {
        if(confetti.state === 'start') {
            confetti.state = 'stopping';
            io.emit('confetti-state', confetti);
        }
        else if(confetti.state === 'stop') {
            confetti.state = 'start';
            io.emit('confetti-state', confetti);
        }
    })

    io.on('connection', (socket) => {
        // FETCH CONFETTI
        socket.on('confetti-fetch', (fn) => {
            console.log(`Sending current confetti state: ${confetti.state}`);
            fn(confetti);
        });

        // UPDATE CONFETTI
        socket.on('confetti-update', function(msg) {
            console.log(`Confetti state: ${msg.state}`);
            confetti = msg;
            io.emit('confetti-state', msg);
        });
    });
};