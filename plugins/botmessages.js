const StreamTimer = require('./utils/StreamTimer.js'),
      fs = require('fs');

// Require Electron-Store to store message settings between settings.
const Store = require('electron-store');

const uuidv1 = require('uuid')

module.exports = function(io) {
    // Create message store.
    const store = new Store();
    // Presistent variables:
    // store.get('botMessages');
    // For debug purposes, store.clear() empties store.
    // store.clear();

    let timer;
    let messageInfo = {messages: [], interval: 1800, enabled: false};
    let currentMessage = -1;

    // Get messages from Electron-Store if they exist.
    if(store.get('botMessages')) {
        messageInfo = store.get('botMessages');
    }

    // Test code to manually set store state.
    /*messageInfo = {
        messages: [
          {
            id: "90d3e5bf-997b-4a7a-9403-b1ef4596667e",
            text: "What's your favorite meat (or meat-alternative)?",
            enabled: true
          },
          {
            id: "90d3e5bf-997b-4a7a-9403-b1ef4596623e",
            text: "Did you ever hear the Tragedy of Darth Plagueis the wise? I thought not. It's not a story the Jedi would tell you. It's a Sith legend.",
            enabled: true
          }
        ],
        interval: 1200,
        enabled: false
    };

    store.set('botMessages', messageInfo);*/

    // Emit initial messages.
    io.emit('message-info', messageInfo);

    // Older file method of saving messages.
    /*fs.readFile('currentMessages.json', (err, data) => {
        if (err) {
            console.log('botmessages.js | readfile(\'currentMessages.json\') | Could not read saved messages file. Perhaps one doesn\'t exist yet?');
            console.error(err);
            messageInfo = {messages: [], interval: 1800, enabled: false}
        } else {
            messageInfo = JSON.parse(data);
            console.log(messageInfo);
            io.emit('message-info', messageInfo);
        }
    });*/

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
            console.log(`botmessages.js | 'message-fetch' | Sending current messages info: ${JSON.stringify(messageInfo)}`);
            fn(messageInfo);

            if (!timer && messageInfo.enabled) {
                initTimer();
            }
        });

        // UPDATE MESSAGES
        socket.on('message-update', function(msg) {
            console.log(`botmessages.js | 'message-update' | Setting messages: '${JSON.stringify(msg.messages)}', interval: ${msg.interval}, enabled: ${msg.enabled}`);
            
            // Save new messages to Electron store.
            store.set('botMessages', msg);

            // Older file based method of saving messages.
            /*fs.writeFile('currentMessages.json', JSON.stringify(msg), (err) => {
                if (err) { console.log(err); }
            });*/

            messageInfo = msg;
            initTimer();

            io.emit('message-info', msg);
        });
    });
};