const nowplaying = require("itunes-nowplaying-mac");
const btoa = require("btoa"); // Buffer to Base64 Package

module.exports = function(io) {
  // Store current track data
  let currentTrack = {
    track: '',
    artist: '',
    album: '',
    artwork: ''
  };

  // Send new track to overlay.
  function emitNowPlaying(track) {
    console.log(`nowplaying-mac.js | Playing: ${track.track} by ${track.artist}`);
    io.emit('itunes-playing', {
        track: track.track,
        artist: track.artist,
        album: track.album,
        artwork: track.artwork
    });
  }

  // Get the currently playing track.
  function getNowPlaying() {
    nowplaying().then(response => {
      // Make sure iTunes is actually playing.
      if(!response) { console.log("nowplaying-mac.js | Did not recieve a response from iTunes."); return; }
  
      // If the new track is the same as the old track, don't bother doing anything else.
      if(response.name !== currentTrack.track) {
        // Try and grab the album art. If the art exists, emit it. Otherwise, catch the error and emit.
        nowplaying.getThumbnailBuffer(response.databaseID).then(imageResponse => {
          // Update the currentTrack;
          currentTrack = {
            track: response.name,
            artist: response.artist,
            album: response.album.name,
            artwork: btoa(imageResponse)
          };
    
          // Let the overlay know the track changed.
          emitNowPlaying(currentTrack);
        })
        .catch(() => {
          console.log("nowplaying-mac.js | Couldn't find an album art.");

          // Update the currentTrack;
          currentTrack = {
            track: response.name,
            artist: response.artist,
            album: response.album.name,
            artwork: ''
          };
    
          // Let the overlay know the track changed.
          emitNowPlaying(currentTrack);
        });
      }
    })

    // getNowPlaying loops forever. Check if the track's changed in another second or two.
    setTimeout(getNowPlaying, 2000);
  }

  // Kick things off initially.
  getNowPlaying();
}