module.exports = function(io) {
    let bannerInfo = {show: false};

    io.on('connection', (socket) => {
        // FETCH BANNER
        socket.on('banner-fetch', (fn) => {
            console.log(`banner.js | banner-fetch | Sending banner info: ${bannerInfo.show}`);
            fn(bannerInfo);
        });

        // UPDATE BANNER
        socket.on('banner-update', function(msg) {
            console.log(`banner.js | banner-update | Setting banner to: ${msg.show}`);
            bannerInfo = msg;
            io.emit('banner-info', msg);
        });
    });
};