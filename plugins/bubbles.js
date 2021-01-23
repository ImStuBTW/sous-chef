module.exports = function(io, clientSocket) {
    // Current bubbles state.
    // Availble Options: Start, Stopping, Stop
    let bubbles = {state: 'stop'};

    // Start bubbles if bubbles is stopped.
    // Stop bubbles if bubbles is running.
    // Do nothing if bubbles is stopping.
    clientSocket.on('bubbles-toggle', () => {
        if(bubbles.state === 'start') {
            console.log('bubbles.js bubbles-toggle: Stopping');
            bubbles.state = 'stopping';
            io.emit('bubbles-state', bubbles);
        }
        else if(bubbles.state === 'stop') {
            console.log('bubbles.js bubbles-toggle: Starting');
            bubbles.state = 'start';
            io.emit('bubbles-state', bubbles);
        }
    })

    io.on('connection', (socket) => {
        // FETCH BUBBLES
        socket.on('bubbles-fetch', (fn) => {
            console.log(`bubbles.js bubbles-fetch Sending current bubbles state: ${bubbles.state}`);
            fn(bubbles);
        });

        // UPDATE BUBBLES
        socket.on('bubbles-update', (msg) => {
            console.log(`bubbles.js bubbles-update Bubbles state: ${msg.state}`);
            bubbles = msg;
            io.emit('bubbles-state', msg);
        });

        // TOGGLE BUBBLES
        socket.on('bubbles-toggle', () => {
            if(bubbles.state === 'start') {
                console.log('bubbles.js bubbles-toggle: Stopping');
                bubbles.state = 'stopping';
                io.emit('bubbles-state', bubbles);
            }
            else if(bubbles.state === 'stop') {
                console.log('bubbles.js bubbles-toggle: Starting');
                bubbles.state = 'start';
                io.emit('bubbles-state', bubbles);
            }
        })
    });
};