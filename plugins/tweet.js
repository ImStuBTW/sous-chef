module.exports = function(io) {
    let tweetInfo = {embed: '', hidden: true};

    io.on('connection', (socket) => {
        // FETCH TWEET
        socket.on('tweet-fetch', (fn) => {
            console.log(`Sending current tweet info: ${tweetInfo.embed}, hidden? ${tweetInfo.hidden}`);
            fn(tweetInfo);
        });

        // UPDATE TWEET
        // This message occurs when a new tweet embed is set on the control page.
        // Set locally, then broadcast tweet details to all listeners.
        socket.on('tweet-update', function(msg) {
            console.log(`Setting tweet embed id: '${msg.embed}', hidden? ${msg.hidden}`);
            tweetInfo = msg;
            io.emit('tweet-info', msg);
        });
    });
};