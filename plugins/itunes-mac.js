// Require iTunes event bridge.
const iTunes = require('itunes-bridge');
const iTunesEmitter = iTunes.emitter;

module.exports = function(io) {
    // iTunes connection & event handling
    function rawDataToBase64(rawData) {
        let hex = /^'tdta'\(\$(.+)\$\)$/,
            matches = hex.exec(rawData);

        if (matches != null) {
            return Buffer.from(matches[1], 'hex').toString('base64');
        }

        return null;
    }

    function emitNowPlaying(currentTrack) {
        if (currentTrack.playerState === 'playing') {
            console.log(`itunes-mac.js | playing: ${currentTrack.name}`);
            io.emit('itunes-playing', {
                track: currentTrack.name,
                artist: currentTrack.artist,
                album: currentTrack.album,
                artwork: rawDataToBase64(currentTrack.rawArtwork)
            });
        }    
    }

    if (iTunes.isRunning()) {
        let currentTrack = iTunes.getCurrentTrack();
        emitNowPlaying(currentTrack);
    }

    // Do something when iTunes is playing
    iTunesEmitter.on('playing', function(type, currentTrack){
        // If it is a paused track that restarts playing
        //if(type === "player_state_change") {
        //    console.log(currentTrack.name + " has been resumed! ");
        //else
        if (type === 'new_track') {
            emitNowPlaying(currentTrack);
        }
    });
};