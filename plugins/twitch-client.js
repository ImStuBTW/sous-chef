// Require Twitch client and client ID config file.
const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client').default;
const twitchKeys = require('../.twitch-key');

// Require Electron BrowserWindow.
const {BrowserWindow} = require('electron');

// Require OAuth helper functionality & query string parser.
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default;
const qs = require('qs');

// Require Electron-Store to store Twitch access token.
const Store = require('electron-store');

module.exports = function(io) {
    const store = new Store();
    // Presistent variables:
    // store.get(botAccessToken);
    // For debug purposes, store.clear() empties store.
    // store.clear();

    const events = {
        HOST: 'twitch-hosted',
        RAID: 'twitch-raid',
        FOLLOW: 'twitch-follower-new',
        SUB: 'twitch-sub',
        RESUB: 'twitch-resub',
        SUBGIFT: 'twitch-subgift',
        SUBRANDOM: 'twitch-subrandom',
        CHAT: 'twitch-chat'
    };

    const   botAccessToken = "botAccessToken",
            ownerAccessToken = "ownerAccessToken";

    // Define Twitch client object and connection states.
    // twitchClient initialized in createTwitchClient.
    let latestFollower = '',
        callbacks = {},
        followers = [],
        subs = [];

    let twitchBot = {
        client: null,
        authenticated: false,
        chatClient: null
    };

    let twitchBroadcaster = {
        client: null,
        authenticated: false,
        chatClient: null
    };

    const connectBot = () => {
        twitchBot.authenticated = true;
        io.emit('twitch-status', true);

        if (!twitchBot.client) {
            TwitchClient.withCredentials(twitchKeys.clientId, store.get(botAccessToken), ['chat:read', 'chat:edit', 'channel:moderate', 'channel:read:subscriptions'])
                .then((client) => {
                    twitchBot.client = client;
                    connectToChat();
                    fetchTwitchFollower();
                });
        }
        // await createTwitchClient();
    };

    const connectBroadcaster = () => {
        twitchBroadcaster.authenticated = true;

        if (!twitchBroadcaster.client) {
            TwitchClient.withCredentials(twitchKeys.clientId, store.get(ownerAccessToken), ['chat:read', 'chat:edit', 'channel:moderate', 'channel:read:subscriptions'])
                .then((client) => {
                    twitchBroadcaster.client = client;
                    connectHostOnlyChat();
                    fetchTwitchSubs();
                });
        }
    };

    // Check if the access token is valid start startup. Initialize app if so.
    if (store.get(botAccessToken)) {
        TwitchClient.getTokenInfo(twitchKeys.clientId, store.get(botAccessToken)).then((results) => {
            if (results._data.valid) {
                connectBot();
            }
        });
    }
    if (store.get(ownerAccessToken)) {
        TwitchClient.getTokenInfo(twitchKeys.clientId, store.get(ownerAccessToken)).then((results) => {
            if (results._data.valid) {
                connectBroadcaster();
            }
        });
    }

    // Async function to create twitchClient instance.
    /*
    const createTwitchClient = async () => {
        if(!twitchBot.client) {
            twitchBot.client = await TwitchClient.withCredentials(twitchKeys.clientId, store.get(botAccessToken), ['chat:read','chat:edit', 'channel:moderate']);
        }
    }
    */

    const connectHostOnlyChat = async () => {
        if (!twitchBroadcaster.chatClient && twitchBroadcaster.authenticated && twitchBroadcaster.client) {
            const chatClient = await ChatClient.forTwitchClient(twitchBroadcaster.client);
            await chatClient.connect();
            await chatClient.waitForRegistration();
            await chatClient.join('andrewcooks');
            twitchBroadcaster.chatClient = chatClient;
    
            chatClient.onHosted((channel, byChannel, auto, viewers) => {
                // NOTE: you MUST be logged in as the channel owner in order to reveive this event (ugh)
                let eventInfo = {
                    channel: channel, 
                    byChannel: byChannel, 
                    auto: auto, 
                    count: viewers
                };

                io.emit(events.HOST, eventInfo);
                triggerCallback(events.HOST, eventInfo);
            });    
        }
    }

    // Connects to Twitch Chat and sets up listeners for chat events.
    const connectToChat = async () => {
        // Only perform if chat isn't already connected and Twitch credentials are valid.
        if(!twitchBot.chatClient && twitchBot.authenticated && twitchBot.client) {
            // Create chatClient connection based off our twitchClient connection.
            // Connect and join to the 'andrewcooks' chatroom.
            // {logLevel: 'debug'}
            const chatClient = await ChatClient.forTwitchClient(twitchBot.client);
            await chatClient.connect();
            await chatClient.waitForRegistration();
            await chatClient.join('andrewcooks');
            console.log("twitch-client.js | Twitch Chat Connected.");
            twitchBot.chatClient = chatClient;

            // Even listeners. Emmit Socket.IO events with all chat objects.
            chatClient.onBitsBadgeUpgrade((channel, user, upgradeInfo, msg) => {
                // Fires when a user upgrades their bits badge in a channel.
                io.emit('twitch-onBitsBadgeUpgrade', Object.assign({}, channel, user, upgradeInfo, msg));
            });
            chatClient.onCommunitySub((channel, user, subInfo, msg) => {
                // Fires when a gifts random subscriptions to the community of a channel.
                let eventInfo = {
                    giftingUser: user,
                    giftCount: subInfo.gifterGiftCount
                };
                io.emit(events.SUBRANDOM, eventInfo);
                triggerCallback(events.SUBRANDOM, eventInfo);
            });
            chatClient.onRaid((channel, user, raidInfo, msg) => {
                let eventInfo = {
                    raidingUser: user,
                    raidingDisplayName: raidInfo ? raidInfo.displayName : user,
                    raidingViewerCount: raidInfo ? raidInfo.viewerCount : null
                }
                io.emit(events.RAID, eventInfo);
                triggerCallback(events.RAID, eventInfo);
            });
            chatClient.onResub((channel, user, subInfo, msg) => {
                let eventInfo = {
                    user: user,
                    subInfo: subInfo,
                    msg: msg
                };
                io.emit(events.RESUB, eventInfo);
                triggerCallback(events.RESUB, eventInfo);
            });
            chatClient.onSub((channel, user, subInfo, msg) => {
                let eventInfo = {
                    user: user,
                    subInfo: subInfo,
                    msg: msg
                };
                io.emit(events.SUB, eventInfo);
                triggerCallback(events.SUB, eventInfo);
            });
            chatClient.onSubGift((channel, user, subInfo, msg) => {
                let eventInfo = {
                    giftingUser: subInfo.gifter,
                    receivingUser: user
                };
                io.emit(events.SUBGIFT, eventInfo);
                triggerCallback(events.SUBGIFT, eventInfo);
            });
            chatClient.onPrivmsg((channel, user, message, msgInfo) => {
                let eventInfo = {
                    user: user, 
                    message: message, 
                    info: msgInfo
                };
                io.emit(events.CHAT, eventInfo);
                triggerCallback(events.CHAT, eventInfo);
            });
        }
    }

    // Function to check if the latest Twitch follower is different from the previous.
    const fetchTwitchFollower = () => {
        // Send the old value while we fetch the latest from Twitch.
        const followResult = twitchBot.client.helix.users.getFollows({'followedUser': '249278489'});
        followResult.getAll().then(result => {
            result.sort(function(a,b) {
                return a._data.followed_at - b._data.followed_at;
            });
            // If the app's starting up, get the most recent user.
            if(latestFollower == '') {
                followers = result.map((follower) => {
                    return follower._data.from_name.toLowerCase();
                });
                followers.push('andrewcooks'); // Don't forget me!
    
                console.log('twitch-client.js | Latest Follower: ' + result[0]._data.from_name);
                latestFollower = result[0]._data.from_name;
            }
            // If there's a new Twitch follower, send it.
            else if(latestFollower !== result[0]._data.from_name) {
                latestFollower = result[0]._data.from_name;
                console.log(`twitch-client.js | New Follower: ${latestFollower}`);
                followers.push(latestFollower.toLowerCase());
                io.emit(events.FOLLOW, {user: latestFollower});
                triggerCallback(events.FOLLOW, {user: latestFollower});
            }
            else {
                //console.log('twitch-client.js  Latest Follower Still: ' +result[0]._data.from_name);
                // Send latest follower during testing. Omit when live.
                io.emit('twitch-follower', result[0]._data.from_name);
            }
        });
    }

    const fetchTwitchSubs = () => {
        const subResult = twitchBroadcaster.client.helix.subscriptions.getSubscriptions('249278489');
        subResult.getAll().then(result => {
            subs = result.map((sub) => {
                return sub.userDisplayName.toLowerCase();
            });
        });
    }

    const sendBotChat = (msg) => {
        if (twitchBot.chatClient) {
            twitchBot.chatClient.say('andrewcooks', msg);
        }
    }

    // Loop Twitch follower check every 10 seconds..
    setInterval(() => {
        if(twitchBot.authenticated) {
            fetchTwitchFollower();
        }
    }, 10000); // 10 Seconds

    // Socket connections.
    io.on('connection', (socket) => {
        const getProvider = () => {
            // Define OAuth provider 
            const provider = new OAuth2Provider({
                authorize_url: "https://id.twitch.tv/oauth2/authorize",
                response_type: "token",
                client_id: twitchKeys.clientId, // Client ID from .gitignored config file. See header.
                redirect_uri: "http://localhost", 
                scope: 'chat:read chat:edit channel:moderate channel:read:subscriptions', // Last comma isn't a typo.
            });

            provider.on("before-authorize-request", parameter => {
                parameter["force_verify"] = "true"
            });            

            return provider;
        };

        const getWindow = () => {
            // Window options for login window.
            const options = Object.assign({
                show: false,
                width: 800,
                height: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                },
            });
        
            // Temporary browser instance for Twitch login.
            let window = new BrowserWindow(options);
            window.once("ready-to-show", () => {
                window.show()
            })
            window.once("closed", () => {
                window = null
            });

            return window;
        };

        // ON init: Send state data to clients.
        socket.on('init', () => {
            console.log('twitch-client.js | init');
            socket.emit('twitch-status', twitchBot.authenticated);
        });

        // ON twitter-fetch: Send state data to clients.
        socket.on('twitch-fetch', (fn) => {
            fn(twitchBot.authenticated);
        });

        // ON twitch-connect-bot: Initiate Twitch OAuth login sequence.
        socket.on('twitch-connect-bot', () => {

            console.log('twitch-client.js | twitch-connect-bot');
            const provider = getProvider();
            let window = getWindow();
        
            // When the OAuth provider has done its job, it closes the window and parases the access token.
            // Access token gets stored in Electron main thread.
            provider.perform(window).then(async (resp) => {
                window.close()
                const token = qs.parse(resp).access_token; // query-string package reads ?=access_token from returned URL
                console.log("twitch-client.js | twitch-connect-bot | Twitch OAuth: Access Token: " + token);
                store.delete(botAccessToken);
                store.set(botAccessToken, token); // Save token to storage
                connectBot();
            })
            .catch((error) => {
                io.emit('twitch-status', false);
                console.error(error);
            });
        });

        socket.on('twitch-connect-owner', () => {

            console.log('twitch-client.js | twitch-connect-owner');
            const provider = getProvider();
            let window = getWindow();
        
            // When the OAuth provider has done its job, it closes the window and parases the access token.
            // Access token gets stored in Electron main thread.
            provider.perform(window).then(async (resp) => {
                window.close()
                const token = qs.parse(resp).access_token; // query-string package reads ?=access_token from returned URL
                console.log("twitch-client.js | twitch-connect-owner | Twitch OAuth: Access Token: " + token);
                store.delete(ownerAccessToken);
                store.set(ownerAccessToken, token); // Save token to storage
                connectBroadcaster();
            })
            .catch((error) => {
                console.error(error);
            });
        });
    });

    const addCallback = (event, callback) => {
        if (event && callback) {
            callbacks[event] = callback;
        }
    };

    const removeCallback = (event) => {
        if (event) {
            delete(callbacks[event]);
        }
    };

    const triggerCallback = (event, msg) => {
        if (callbacks[event]) {
            callbacks[event](msg);
        }
    }

    const isFollower = (user) => {
        return followers.includes(user.toLowerCase());
    }

    const isSub = (user) => {
        return subs.includes(user.toLowerCase());
    }

    return {
        events: events,
        sendBotChatMsg: sendBotChat,
        isFollower: isFollower,
        isSub: isSub,
        on: addCallback,
        off: removeCallback
    };
};