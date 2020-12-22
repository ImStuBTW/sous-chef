module.exports = function(io, clientSocket) {
    let noticeInfo = {users: []};

    const noticeUpdate = (msg) => {
        if (!msg.show) {
            noticeInfo.users = [];
        }
        else if (!noticeInfo.users.includes(msg.user)) {
            if (noticeInfo.users.length < 4) {
                noticeInfo.users.push(msg.user);
            }
            else if (noticeInfo.users.length === 4) {
                noticeInfo.users.push('and others');
            }
        }
        else {
            // Don't do anything if this user is already participating.
            return;
        }

        console.log(`Setting notice: ${JSON.stringify(noticeInfo)}`);
        io.emit('notice-info', {show: msg.show, users: noticeInfo.users, sound: msg.sound});
    };

    // This is so we can listen to events coming from Twitch
    clientSocket.on('notice-update', noticeUpdate);

    io.on('connection', (socket) => {
        // FETCH NOTICE
        socket.on('notice-fetch', (fn) => {
            console.log(`Sending current notice info: ${JSON.stringify(noticeInfo)}`);
            fn(noticeInfo);
        });

        // UPDATE NOTICE
        socket.on('notice-update', noticeUpdate);
    });
};