// Require Twitter client and bearer token.
var Twitter = require('twitter');
const twitterKeys = require('../.twitter-key');

module.exports = function(io) {
    var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        bearer_token: twitterKeys.bearer_token
    });

    let tweetInfo = {embed: '', hidden: true};

    io.on('connection', (socket) => {
        // FETCH TWEET
        socket.on('tweet-fetch', (fn) => {
            console.log(`tweet.js | tweet-fetch | Sending current tweet info: ${tweetInfo.embed}, hidden? ${tweetInfo.hidden}`);
            fn(tweetInfo);
        });

        // UPDATE TWEET
        // This message occurs when a new tweet embed is set on the control page.
        // Set locally, then broadcast tweet details to all listeners.
        socket.on('tweet-update', function(msg) {
            console.log(`tweet.js | tweet-update | Setting tweet embed id: '${msg.embed}', hidden? ${msg.hidden}`);

            let tempInfo = {embed: '', tweet: '', hidden: true};

            if(msg.hidden === true || msg.embed === '') {
                tweetInfo = tempInfo;
                console.log(tweetInfo);
                io.emit('tweet-info', tweetInfo);
            }
            else if(msg.embed !== '') {
                if(msg.embed.length > 4 && msg.embed.slice(0,4) === 'http') {
                    const tweetId = msg.embed.split('status/')[1].split('/')[0];
                    client.get('statuses/show/' + tweetId, function(error, tweet, response) {
                        console.log('tweet.js | tweet-update | Tweet fetched via URL.');
                        tempInfo = {embed: msg.embed, hidden: msg.hidden, tweet: tweet};
                        tweetInfo = tempInfo;
                        console.log(tweetInfo);
                        io.emit('tweet-info', tweetInfo);
                     });
                }
                else {
                    client.get('statuses/show/' + msg.embed, function(error, tweet, response) {
                        console.log('tweet.js | tweet-update | Tweet fetched via ID.');
                        tempInfo = {embed: msg.embed, hidden: msg.hidden, tweet: tweet};
                        tweetInfo = tempInfo;
                        console.log(tweetInfo);
                        io.emit('tweet-info', tweetInfo);
                     });
                }
            }
        });
    });
};