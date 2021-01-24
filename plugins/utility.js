 // Use ip.address() to get current IP address.
const ip = require('ip');

module.exports = function(io, port) {
    // Socket Connections
    io.on('connection', (socket) => {
        // ON howdy: Test socket.
        socket.on('howdy', () => {
            console.log('utility.js | Howdy!');
        })

        // ON init: Send state data to clients.
        socket.on('init', () => {
            console.log('utility.js | init');
            socket.emit('ip', ip.address(), () => console.log('ip emitted'));
        })
    });
};