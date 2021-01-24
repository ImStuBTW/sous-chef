const twitchClient = require('./twitch-client');
const twitchUrl = 'https://twitch.tv/';

module.exports = function(io, clientSocket) {
    let twitch = twitchClient(io);

    // This is so we can listen to other plugins that want to post to Twitch
    clientSocket.on('twitch-chatpost', (msg) => twitch.sendBotChatMsg(msg.message));

    // Connect twitch events that we care about.
    twitch.on(twitch.events.HOST, (msg) => {
        console.log(`twitch.js | HOST! ${msg.byChannel} hosted with ${msg.count} viewers`);
        io.emit('confetti-single', {});
        twitch.sendBotChatMsg(`Thank you for the host ${msg.byChannel}! Everyone please give them a follow! ${twitchUrl}${msg.byChannel}`);
    });

    twitch.on(twitch.events.RAID, (msg) => {
        console.log(`twitch.js | RAID! User: ${msg.raidingUser}${msg.raidingDisplayName ? ` (${msg.raidingDisplayName}, ${msg.raidingViewerCount} viewers)` : ''}`);
        io.emit('confetti-state', {state: 'start'});
        twitch.sendBotChatMsg(`Thank you so much for the raid ${msg.raidingUser}! Everyone please give them a follow! ${twitchUrl}${msg.raidingUser}`);
    });

    twitch.on(twitch.events.FOLLOW, (msg) => {
        io.emit('confetti-single', {});
        twitch.sendBotChatMsg(`Thanks for the follow ${msg.user}! I appreciate it!`);
    });

    [twitch.events.SUB, twitch.events.RESUB].forEach((event) => {
        let isResub = (event === twitch.events.RESUB),
            subText = isResub ? 'resubscribing' : 'subscribing',
            extraText = isResub ? 'EXTRA awesome!' : 'awesome';

        let callback = (msg) => {
            io.emit('confetti-single', {});
            twitch.sendBotChatMsg(`Thank you for ${subText} ${msg.user}! You're ${extraText}!`);
        };
        twitch.on(event, callback);
    });

    twitch.on(twitch.events.SUBRANDOM, (msg) => {
        io.emit('confetti-single', {});
        twitch.sendBotChatMsg(`Thank you for gifting ${msg.giftCount > 1 ? 'subs' : 'a sub'} ${msg.giftingUser}!`);
    });

    twitch.on(twitch.events.SUBGIFT, (msg) => {
        io.emit('confetti-single', {});
        if (msg.giftingUser) {
            twitch.sendBotChatMsg(`Thank you ${msg.giftingUser} for gifting a sub to ${msg.receivingUser}!`);
        } else {
            twitch.sendBotChatMsg(`${msg.receivingUser} received a gift sub!`);
        }
    });

    twitch.on(twitch.events.CHAT, (msg) => {
        let lowerMessage = msg.message.toLowerCase(),
            maxConfetti = 50,
            maxBubbles = 50;

        if (twitch.isFollower(msg.user) && lowerMessage.includes('!')) {
            let confettiRegEx = /!confetti\s?(\d+)?/,
                bubbleRegEx = /!tipsy\s?(\d+)?/,
                noticeRegEx = /!(hey|listen)/,
                sceneRegEx = /!(stove|kitchen|board|doggo)/,
                triviaRegEx = /!(trivia|question|answer)\s?(.+)?/;

            let match = confettiRegEx.exec(lowerMessage);

            if (match) {
                console.log(`twitch.js | ${msg.user} triggered a confetti burst`);
                let props = {};
                if (match[1] && twitch.isSub(msg.user)) {
                    let amt = parseInt(match[1]);
                    props = {amount: (amt && amt > 0 && amt <= maxConfetti) ? amt : 10};
                }
                io.emit('confetti-single', props);
                return;
            }

            match = bubbleRegEx.exec(lowerMessage);

            if (match) {
                console.log(`twitch.js | ${msg.user} triggered a bubble burst`);
                let props = {};
                if (match[1] && twitch.isSub(msg.user)) {
                    let amt = parseInt(match[1]);
                    props = {amount: (amt && amt > 0 && amt <= maxBubbles) ? amt : 10};
                }
                twitch.sendBotChatMsg(`${msg.user} makes everyone feel tipsy!`);
                io.emit('bubbles-single', props);
                return;
            }

            match = noticeRegEx.exec(lowerMessage);

            if (match) {
                let sound = 'hey';
                console.log(`twitch.js | ${msg.user} wanted to get our attention`);

                if (match[1] === 'listen' && twitch.isSub(msg.user)) {
                    sound = 'listen';
                }

                io.emit('notice-update', {show: true, user: msg.user, sound: sound});
            }

            match = sceneRegEx.exec(lowerMessage);

            if (match) {
                if (match[1]) {
                    console.log(`twitch.js | ${msg.user} triggered a scene change`);
                    io.emit('obs-scene-switch', {sceneTag: match[1], user: msg.user, isSub: twitch.isSub(msg.user)});
                }
            }

            match = triviaRegEx.exec(lowerMessage);

            if (match) {
                let command = match[1], answer = match[2];
                switch(command) {
                    case 'trivia':
                        console.log(`twitch.js | ${msg.user} requested trivia intro.`);
                        io.emit('trivia-intro');
                        break;
                    case 'question':
                        console.log(`twitch.js | ${msg.user} requested current trivia question.`);
                        io.emit('trivia-question');
                        break;
                    case 'answer':
                        console.log(`twitch.js | ${msg.user} submitted an answer: ${answer}`);
                        if (answer && answer.trim() !== '') {
                            io.emit('trivia-answer', {answer: answer.toLowerCase(), user: msg.user});
                        }
                        break;
                }
            }
        }
    });
};