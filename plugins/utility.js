 // Use ip.address() to get current IP address.
const ip = require('ip');

module.exports = function(io, port) {
    // Socket Connections
    io.on('connection', (socket) => {
        // ON howdy: Test socket.
        socket.on('howdy', () => {
            console.log('Howdy!');
        })

        // ON init: Send state data to clients.
        socket.on('init', () => {
            console.log('utility.js init');
            socket.emit('ip', ip.address(), () => console.log('ip emitted'));
        })

        // On header-init: Send IP address back to head.
        socket.on('header-init', () => {
            console.log('utility.js header-init');
            socket.emit('ip', ip.address(), () => console.log('ip emitted'));
        })
    });
};