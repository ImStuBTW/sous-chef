// Require OBS Websockets client. Requires local install of: https://github.com/Palakis/obs-websocket
const OBSWebSocket = require('obs-websocket-js'),
      fs = require('fs');
const {globalShortcut} = require('electron');

module.exports = function(io, clientSocket) {
    // OBS State
    let obsConnected = false,
        obsScenes = [],
        bindings = [],
        controlSettings = {
            users: [],
            allSubs: false
        };

    // Create new OBSWebSocket object.
    const obs = new OBSWebSocket();

    const obsChangeScene = (scene) => {
        // TODO: Use obsSendCommand
        obs.send('SetCurrentScene', {'scene-name': scene}).then((response) => {
            if(response.status === 'ok') {
                io.emit('obs-scene-info', scene);
            }
        })
    };

    const obsSendCommand = (command, params) => {
        return obs.send(command, params);
    }

    const obsConnect = () => {
        // Connect to default OBS address. Add password if on public network.
        obs.connect({
            address: 'localhost:4444', // Trailing Comma Intentional
            // password: 'obs-websockets-password'
        })
        .then(() => {
            console.log('obs-connect: Successfully connected to OBS.');
            obsConnected = true;
            io.emit('obs-status', true);
            return obs.send('GetSceneList');
        })
        .then((data) => {
            console.log('obs-connect: ' + data.scenes.length + ' available OBS scenes.');
            obsScenes = data.scenes.map((scene) => scene.name);
            console.log(`obs-connect: Scene names ${JSON.stringify(obsScenes)}`);
            io.emit('obs-scenes', obsScenes);
        })
        .catch(err => {
            obsConnected = false;
            io.emit('obs-status', false);
            io.emit('obs-scenes', []);
            console.log('obs-connect: Something went wrong connecting to OBS.');
            console.log(err);
        });
    }

    // Attempt to connect when app started.
    obsConnect();

    clientSocket.on('obs-scene-switch', (data) => {
        let sceneName,
            lowerUsername = data.user.toLowerCase();

        bindings.forEach(binding => {
            if (binding.tag === data.sceneTag) {
                sceneName = binding.scene;
            }
        });

        if (sceneName) {
            let validScene = true;

            obs.send('GetCurrentScene').then((currentScene) => {
                bindings.forEach(binding => {
                    if (binding.scene === currentScene.name) {
                        validScene = (binding.tag != 'end');
                    }
                });

                if (validScene && ((controlSettings.allSubs && data.isSub) || (controlSettings.users.includes(lowerUsername)))) {
                    obsChangeScene(sceneName);
                }
                else {
                    io.emit('twitch-chatpost', {message: `I'm sorry, @${data.user}. I'm afraid I can't do that.`});
                }
            });
        }
    });

    // Socket Connections
    io.on('connection', (socket) => {
        // When the Socket connection is created, register global shortcuts.
        // Putting this in the io.on('connection') instead of obsConnect() allows us to use io.emit to trigger confetti.
        fs.readFile('keyBindings.json', (err, data) => {
            if (err) {
                console.log('Could not read saved OBS key bindings. Perhaps one doesn\'t exist yet?');
                console.error(err); 
            } else {
                bindings = JSON.parse(data);
                io.emit('obs-bindings', bindings);

                bindings.forEach(binding => {
                    globalShortcut.register(binding.key, () => { 
                        if (binding.scene) {
                            console.log(`${binding.key}: Scene switch to ${binding.scene}`); 
                            obsChangeScene(binding.scene);
                        }
                        else if (binding.command) {
                            console.log(`${binding.key}: Sending OBS command ${binding.command}`);
                            obsSendCommand(binding.command, binding.params);
                        }
                        else if (binding.emit) {
                            console.log(`${binding.key}: Socket emit ${binding.emit}`);
                            io.emit(binding.emit);
                        }
                    });
                });
            }
        });

        /*
        globalShortcut.register('F6', () => { console.log('F6! Toggle Mute'); obs.send('ToggleMute', {'source': 'Mic/Aux'}); });
        globalShortcut.register('F7', () => { console.log('F7!. Toggle Confetti'); io.emit('confetti-toggle'); });
        globalShortcut.register('F8', () => { console.log('F8 was pressed. Triggering: Beer Bubbles'); io.emit('bubbles-toggle'); });
        globalShortcut.register('F9', () => { console.log('F9! Stop Stream'); obs.send('StopStreaming'); });
        globalShortcut.register('F10', () => {
            console.log('F10! Something should be done here.');
            // TODO: Figure out what to do with F10
        });
        */

        // ON init: Send state data to clients.
        socket.on('init', () => {
            console.log('obs.js init');
            io.emit('obs-status', obsConnected);
            io.emit('obs-scenes', obsScenes.map((scene) => {return scene['name']}));
        });

        // ON header-init: Send state to navbar.
        socket.on('header-init', () => {
            console.log('obs.js header-init');
            io.emit('obs-status', obsConnected);
        })
        
        // ON obs-connect: Attempt to connect to OBS. Respond with OBS status and scene list.
        socket.on('obs-connect', () => {
            console.log('obs.js obs-connect');
            obsConnect();
        });

        // ON obs-scene-fetch: Return current OBS scene.
        socket.on('obs-scene-fetch', () => {
            console.log('obs.js obs-scene-fetch');
            obs.send('GetCurrentScene').then((currentScene) => {
                io.emit('obs-scene-info', currentScene.name);
            })
        });

        // ON obs-scene-set: Change scene. Requires scene name. Returns with current OBS scene.
        socket.on('obs-scene-set', (payload) => {
            console.log('obs.js obs-scene-set ' + payload.scene);
            obsChangeScene(payload.scene);
        });

        socket.on('obs-scene-control-fetch', (fn) => {
            console.log(`obs.js obs-scene-control-fetch: ${JSON.stringify(controlSettings)}`);
            fn(controlSettings);
        });

        socket.on('obs-scene-control-set', (payload) => {
            console.log(`obs.js obs-scene-control-set: ${JSON.stringify(payload)}`);
            controlSettings = payload;
        });

        socket.on('obs-send-command', (payload) => {
            console.log('obs.js obs-send-command ' + payload.command);
            obsSendCommand(payload.command, payload.params);
        });
    });
};