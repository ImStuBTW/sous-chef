// Require Twitch client and client ID config file.
const {ApiClient} = require('@twurple/api');
const {StaticAuthProvider} = require('@twurple/auth');
const {ChatClient} = require('@twurple/chat');
const {PubSubClient, PubSubSubscriptionMessage} = require('@twurple/pubsub');
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
        CHAT: 'twitch-chat',
        REDEEM: 'twitch-redemption'
    };

    const   botAccessToken = "botAccessToken",
            ownerAccessToken = "ownerAccessToken";

    const permissions = ['chat:read', 'chat:edit', 'channel:moderate', 'channel:read:subscriptions', 
        'channel:read:redemptions', 'channel:manage:polls'];

    // Define Twitch client object and connection states.
    // twitchClient initialized in createTwitchClient.
    let latestFollower = '',
        callbacks = {},
        followers = [],
        subs = [],
        channelUser;

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

    const getAuthProvider = (accessToken) => {
        // Create authProvider containing access token & requested permissions
        const authProvider = new StaticAuthProvider(twitchKeys.clientId, accessToken, permissions);
        return authProvider;
    }

    // Connect the twitch bot by saving an instance of the API client
    // and connecting to chat.
    // NOTE: apiClient is optional.
    const connectBot = (authProvider, apiClient) => {
        twitchBot.authenticated = true;
        io.emit('twitch-bot-status', true);

        if (!twitchBot.client) {
            // Save an API client instance for later use
            twitchBot.client = (apiClient) ? apiClient : new ApiClient({authProvider});

            twitchBot.client.users.getUserByName('andrewcooks')
                .then((user) => {
                    if (user) {
                        channelUser = user;
                    }        
                });

            // Also connect to chat
            connectToChat(authProvider);
            fetchTwitchFollower();
        }
    };

    // Connect the broadcaster by saving an instance of the API client
    // and connecting to chat.
    // NOTE: apiClient is optional.
    const connectBroadcaster = (authProvider, apiClient) => {
        twitchBroadcaster.authenticated = true;
        io.emit('twitch-broadcaster-status', true);

        if (!twitchBroadcaster.client) {
            // Save an API client instance for later use
            twitchBroadcaster.client = (apiClient) ? apiClient : new ApiClient({authProvider});

            // Also connect to chat
            connectHostOnlyChat(authProvider);
            connectToPubSub(authProvider);
            fetchTwitchSubs();
        }
    };

    // Check if the access token is valid on startup. Initialize app if so.
    if (store.get(botAccessToken)) {
        let authProvider = getAuthProvider(store.get(botAccessToken));
        let botClient = new ApiClient({authProvider});
        botClient.getTokenInfo(store.get(botAccessToken), twitchKeys.clientId).then((results) => {
            console.log(`twitch-client.js | Bot access token valid. Expires: ${results.expiryDate}`);
            connectBot(authProvider, botClient);
        }).catch((error) => {
            console.error(`[ERROR] twitch-client.js | Unable to use saved bot token: ${error}`);
        });
    }
    if (store.get(ownerAccessToken)) {
        let authProvider = getAuthProvider(store.get(ownerAccessToken));
        let ownerClient = new ApiClient({authProvider});
        ownerClient.getTokenInfo(store.get(ownerAccessToken), twitchKeys.clientId).then((results) => {
            console.log(`twitch-client.js | Owner access token valid. Expires: ${results.expiryDate}`);
            connectBroadcaster(authProvider, ownerClient);
        }).catch((error) => {
            console.error(`[ERROR] twitch-client.js | Unable to use saved broadcaster token: ${error}`);
        });
    }

    const connectToPubSub = (authProvider) => {
        const pubSubClient = new PubSubClient();
        pubSubClient.registerUserListener(authProvider)
            .then(async (userId) => {
                console.log("twitch-client.js | Successfully connected to pubsub.");
                await pubSubClient.onRedemption(userId, (message) => {
                    /*
                    channelId
                    defaultImage
                    id
                    message
                    redemptionDate
                    rewardCost
                    rewardId
                    rewardImage
                    rewardIsQueued
                    rewardPrompt
                    rewardTitle
                    status
                    userDisplayName
                    userId
                    userName
                    */
                    console.log(`twitch-client.js | ${message.rewardTitle} (${message.rewardId}) just redeemed by ${message.userName}!`);
                    let eventInfo = {
                        id: message.rewardId,
                        title: message.rewardTitle,
                        userId: message.userId,
                        userName: message.userName,
                        userDisplayName: message.userDisplayName
                    };
                    io.emit(events.REDEEM, eventInfo);
                    triggerCallback(events.REDEEM, eventInfo);
                });        
            })
    }

    // Connects to Twitch Chat and sets up listeners for chat events.
    const connectToChat = async (authProvider) => {
        // Only perform if chat isn't already connected and Twitch credentials are valid.
        if(!twitchBot.chatClient && twitchBot.authenticated && twitchBot.client) {
            // Create chatClient connection based off our twitchClient connection.
            // Connect and join to the 'andrewcooks' chatroom.
            let chatClient;

            if (authProvider) {
                chatClient = new ChatClient({
                    authProvider: authProvider,
                    channels: ['andrewcooks']
                });
            } else {
                // This is the old deprecated method and probably won't work soon (if not already).
                // It's here in case legacy code calls this without an authProvider.
                chatClient = await ChatClient.forTwitchClient(twitchBot.client);
            }

            await chatClient.connect()
                .catch((err) => {
                    console.error(`[ERROR] twitch-client.js | Unable to connect bot to chat: ${err}`);
                });

            chatClient.onRegister(async () => {
                await chatClient.join('andrewcooks');
                console.log("twitch-client.js | Twitch Bot connected to chat.");
                twitchBot.chatClient = chatClient;
    
                // Event listeners. Emmit Socket.IO events with all chat objects.
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
            });
        }
    }

    // Connects to Twitch Chat and sets up listeners for chat events.
    // This one is specifically for the broadcaster, since it's the only way to get Host events.
    const connectHostOnlyChat = async (authProvider) => {
        // Only perform if chat isn't already connected and Twitch credentials are valid.
        if (!twitchBroadcaster.chatClient && twitchBroadcaster.authenticated && twitchBroadcaster.client) {
            // Create chatClient connection based off our twitchClient connection.
            // Connect and join to the 'andrewcooks' chatroom.
            let chatClient;

            if (authProvider) {
                chatClient = new ChatClient({
                    authProvider: authProvider,
                    channels: ['andrewcooks']
                });
            } else {
                // This is the old deprecated method and probably won't work soon (if not already).
                // It's here in case legacy code calls this without an authProvider.
                chatClient = await ChatClient.forTwitchClient(twitchBroadcaster.client);
            }

            await chatClient.connect()
                .catch((err) => {
                    console.error(`[ERROR] twitch-client.js | Unable to connect broadcaster to chat: ${err}`);
                });

            chatClient.onRegister(async () => {
                console.log("twitch-client.js | Twitch Broadcaster connected to chat.");
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
            });
        }
    }

    // Function to check if the latest Twitch follower is different from the previous.
    const fetchTwitchFollower = () => {
        // Send the old value while we fetch the latest from Twitch.
        const followResult = twitchBot.client.helix.users.getFollowsPaginated({'followedUser': '249278489'});
        followResult.getAll().then(result => {
            result.sort(function(a,b) {
                return b.followDate - a.followDate;
            });
            // If the app's starting up, get the most recent user.
            if(latestFollower == '') {
                followers = result.map((follower) => {
                    return follower.userName.toLowerCase();
                });
                followers.push('andrewcooks'); // Don't forget me!
    
                console.log('twitch-client.js | Latest Follower: ' + result[0].userDisplayName);
                latestFollower = result[0].userDisplayName;
            }
            // If there's a new Twitch follower, send it.
            else if(latestFollower !== result[0].userDisplayName) {
                latestFollower = result[0].userDisplayName;
                console.log(`twitch-client.js | New Follower: ${latestFollower}`);
                followers.push(result[0].userName.toLowerCase());
                io.emit(events.FOLLOW, {user: latestFollower});
                triggerCallback(events.FOLLOW, {user: latestFollower});
            }
            else {
                //console.log('twitch-client.js  Latest Follower Still: ' +result[0]._data.from_name);
                // Send latest follower during testing. Omit when live.
                io.emit('twitch-follower', result[0].userDisplayName);
            }
        });
    }

    // Get a list of all subscriber usernames.
    // This probably won't scale if the channel gets popular, but let's worry about that if we get there. :p
    const fetchTwitchSubs = () => {
        const subResult = twitchBroadcaster.client.helix.subscriptions.getSubscriptionsPaginated('249278489');
        subResult.getAll().then(result => {
            subs = result.map((sub) => {
                return sub.userDisplayName.toLowerCase();
            });
        });
    }

    // Send a message to chat using the bot.
    const sendBotChat = (msg) => {
        if (twitchBot.chatClient) {
            twitchBot.chatClient.say('andrewcooks', msg).catch((err) => console.log(err));
        }
    }

    const createPoll = (question, choices, duration) => {
        if (twitchBroadcaster.client) {
            twitchBroadcaster.client.polls.createPoll(channelUser, {
                title: question,
                choices: choices,
                duration: duration,
                channelPointsPerVote: 10
            });
            sendBotChat("A new poll has started! Vote using your Twitch app or /vote in chat.");
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
                redirect_uri: "http://localhost/", 
                scope: permissions.join(' ')
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

            window.webContents.on('will-navigate', function (event, newUrl) {
                console.log("twitch-client.js | getWindow | Will-Navigate: " + newUrl);
            });

            return window;
        };

        // ON init: Send state data to clients.
        socket.on('init', () => {
            console.log('twitch-client.js | init');
            socket.emit('twitch-bot-status', twitchBot.authenticated);
            socket.emit('twitch-broadcaster-status', twitchBroadcaster.authenticated);
        });

        // ON twitter-bot-fetch: Send state data to clients.
        socket.on('twitch-bot-fetch', (fn) => {
            fn(twitchBot.authenticated);
        });

        // ON twitter-broadcaster-fetch: Send state data to clients.
        socket.on('twitch-broadcaster-fetch', (fn) => {
            fn(twitchBroadcaster.authenticated);
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
                console.log(resp);
                const token = qs.parse(resp).access_token; // query-string package reads ?=access_token from returned URL
                console.log("twitch-client.js | twitch-connect-bot | Twitch OAuth: Access Token: " + token);
                store.delete(botAccessToken);
                store.set(botAccessToken, token); // Save token to storage
                let authProvider = getAuthProvider(token);
                connectBot(authProvider);
            })
            .catch((error) => {
                io.emit('twitch-bot-status', false);
                console.error(`[ERROR] twitch-client.js | Bot Auth error: ${error}`);
            });
        });

        socket.on('twitch-connect-owner', () => {
            console.log('twitch-client.js | twitch-connect-owner');
            const provider = getProvider();
            let window = getWindow();
        
            // When the OAuth provider has done its job, it closes the window and parases the access token.
            // Access token gets stored in Electron main thread.
            provider.perform(window).then(async (resp) => {
                window.close();
                const token = qs.parse(resp).access_token; // query-string package reads ?=access_token from returned URL
                console.log("twitch-client.js | twitch-connect-owner | Twitch OAuth: Owner Token: " + token);
                store.delete(ownerAccessToken);
                store.set(ownerAccessToken, token); // Save token to storage
                let authProvider = getAuthProvider(token);
                connectBroadcaster(authProvider);
            })
            .catch((error) => {
                io.emit('twitch-broadcaster-status', false);
                console.error(`[ERROR] twitch-client.js | Broadcaster Auth error: ${error}`);
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
        off: removeCallback,
        createPoll: createPoll
    };
};