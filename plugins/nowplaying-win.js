const itunes = require("itunes-nowplaying-win");
const fs = require('fs');
const { app } = require('electron');

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
    console.log(`nowplaying-win.js | Playing: ${track.track} by ${track.artist}`);
    io.emit('itunes-playing', {
        track: track.track,
        artist: track.artist,
        album: '',
        artwork: track.artwork
    });
  }

  function getNowPlaying() {
    // Note that iTunes.getNowplaying doesn't have a capital P.
    itunes.getNowplaying((err, track) => {
      if(err) { console.log('nowplaying-win.js | Error: ' + err); }

      // Make sure iTunes is responding.
      if(track) {
        console.log('nowplaying-win.js | No track currently playing.');
        currentTrack = {
          track: '',
          artist: '',
          album: '',
          artwork: ''
        }
      }
      else {
        // If the new track is the same as the old track, don't bother doing anything else.
        if(track.name !== currentTrack.track) {

          // If able to find album art, save it to a temp file. (Package limitation.)
          if(track.artworkCount > 0) {
            // Create the tempfile name.
            const tmpArtworkPath = app.getPath("temp") + "\\temp." + track.artworkFormat;
            console.log('nowplaying-win.js | tempfile: ' + tmpArtworkPath);

            // Save artwork to tempfile.
            itunes.saveNowplayingArtworkToFile(tmpArtworkPath, (err) => {
              if(err) { console.log('nowplaying-win.js | Error: ' + err); }
              console.log(`save artwork to: ${tmpArtworkPath}`);
              
              // Read file's base 64 into variable.
              const image = fs.readFileSync(tmpArtworkPath, {encoding: 'base64'});

              // Update the currentTrack;
              currentTrack = {
                track: track.name,
                artist: track.artist,
                album: '',
                artwork: image
              };
            
              // Let the overlay know the track changed.
              emitNowPlaying(currentTrack);
            });


          }
          else {
            console.log("nowplaying-win.js | Couldn't find an album art.");

            // Update the currentTrack;
            currentTrack = {
              track: track.name,
              artist: track.artist,
              album: '',
              artwork: ''
            };
      
            // Let the overlay know the track changed.
            emitNowPlaying(currentTrack);
          }
        }
      }
    })

    // getNowPlaying loops forever. Check if the track's changed in another second or two.
    setTimeout(getNowPlaying, 2000);
  }

  // Kick things off initially.
  getNowPlaying();
}