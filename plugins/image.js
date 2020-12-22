module.exports = function(io) {
    let imageInfo = {url: '', hidden: true};

    io.on('connection', (socket) => {
        // FETCH IMAGE
        socket.on('image-fetch', (fn) => {
            console.log(`Sending current image info: ${imageInfo.url}, hidden? ${imageInfo.hidden}`);
            fn(imageInfo);
        });

        // UPDATE IMAGE
        // This message occurs when a new image URL is set on the control page.
        // Set locally, then broadcast URL details to all listeners.
        socket.on('image-update', function(msg) {
            console.log(`Setting image URL '${msg.url}', hidden? ${msg.hidden}`);
            imageInfo = msg;
            io.emit('image-info', msg);
        });
    });
};