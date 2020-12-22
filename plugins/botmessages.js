const StreamTimer = require('../utils/StreamTimer.js'),
      fs = require('fs');

module.exports = function(io) {
    let timer, messageInfo,
        currentMessage = -1;

    fs.readFile('currentMessages.json', (err, data) => {
        if (err) {
            console.log('Could not read saved messages file. Perhaps one doesn\'t exist yet?');
            console.error(err);
            messageInfo = {messages: [], interval: 1800, enabled: false}
        } else {
            messageInfo = JSON.parse(data);
            io.emit('message-info', messageInfo);
        }
    });

    let getNextMessage = () => {

        currentMessage = (currentMessage + 1 === messageInfo.messages.length) ? 0 : currentMessage + 1;
        let start = currentMessage;
        while (!messageInfo.messages[currentMessage].enabled) {
            currentMessage++;

            if (currentMessage >= messageInfo.messages.length) {
                currentMessage = 0;
            }

            if (start === currentMessage) {
                return null;
            }
        }

        return messageInfo.messages[currentMessage];
    };

    let postMessage = () => {
        //io.emit('twitch-chatpost', {message: "For the next month we're raising money for organizations that help those fighting or recovering from breast cancer! Please consider donating if you can -- every bit & dollar helps. Type !donate for details."});
        if (messageInfo && messageInfo.messages && messageInfo.messages.length > 0) {
            let msg = getNextMessage();

            if (msg != null) {
                io.emit('twitch-chatpost', {message: msg.text});
            }
        }
        timer.repeatTimer();
    };

    let initTimer = () => {
        if (timer) {
            timer.disposeTimer();
        }
        if (messageInfo.enabled) {
            timer = new StreamTimer('msgTimer', 'Message Timer', messageInfo.interval, null, postMessage);
        }
    };

    //timer = new StreamTimer('msgTimer', 'Message Timer', 900, null, postMessage);

    io.on('connection', (socket) => {
        // FETCH MESSAGES
        socket.on('message-fetch', (fn) => {
            console.log(`Sending current messages info: ${JSON.stringify(messageInfo)}`);
            fn(messageInfo);

            if (!timer && messageInfo.enabled) {
                initTimer();
            }
        });

        // UPDATE MESSAGES
        socket.on('message-update', function(msg) {
            console.log(`Setting messages: '${JSON.stringify(msg.messages)}', interval: ${msg.interval}, enabled: ${msg.enabled}`);
            fs.writeFile('currentMessages.json', JSON.stringify(msg), (err) => {
                if (err) { console.log(err); }
            });

            messageInfo = msg;
            initTimer();

            io.emit('message-info', msg);
        });
    });
};