module.exports = function(io, clientSocket) {
    // Current bubbles state.
    // Availble Options: Start, Stopping, Stop
    let bubbles = {state: 'stop'};

    // Start bubbles if bubbles is stopped.
    // Stop bubbles if bubbles is running.
    // Do nothing if bubbles is stopping.
    clientSocket.on('bubbles-toggle', () => {
        if(bubbles.state === 'start') {
            bubbles.state = 'stopping';
            io.emit('bubbles-state', bubbles);
        }
        else if(confetti.state === 'stop') {
            bubbles.state = 'start';
            io.emit('bubbles-state', bubbles);
        }
    })

    io.on('connection', (socket) => {
        // FETCH BUBBLES
        socket.on('bubbles-fetch', (fn) => {
            console.log(`Sending current image info: ${imageInfo.url}, hidden? ${imageInfo.hidden}`);
            fn(imageInfo);
        });

        // UPDATE BUBBLES
        socket.on('bubbles-update', function(msg) {
            console.log(`Bubbles state: ${msg.state}`);
            io.emit('bubbles-state', msg);
        });
    });
};