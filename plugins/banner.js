module.exports = function(io) {
    let bannerInfo = {show: false};

    io.on('connection', (socket) => {
        // FETCH BANNER
        socket.on('banner-fetch', (fn) => {
            console.log(`Sending current banner info: ${bannerInfo.show}`);
            fn(bannerInfo);
        });

        // UPDATE BANNER
        socket.on('banner-update', function(msg) {
            console.log(`Setting banner show state '${msg.show}'`);
            bannerInfo = msg;
            io.emit('banner-info', msg);
        });
    });
};