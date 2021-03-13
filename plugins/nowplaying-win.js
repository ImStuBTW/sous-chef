const itunes = require("itunes-nowplaying-win");

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
        album: track.album,
        artwork: track.artwork
    });
  }

  function getNowPlaying() {
    itunes.getNowPlaying((err, track) => {
      if(err) { console.log('nowplaying-win.js | Error: ' + err); }

      console.log('nowplaying-win.js | track: ');
      console.log(track);

      // If able to find album art, save it to a temp file. (Package limitation.)
      if(track.artworkCount > 0) {
        // Create the tempfile name.
        let tempfile = 'temp.' + track.artworkFormat;
        console.log('nowplaying-win.js | tempfile: ' + tempfile);

        // Save artwork to tempfile.
        itunes.saveNowplayingArtworkToFile(tempfile, (err) => {
          if(err) { console.log('nowplaying-win.js | Error: ' + err); }

          // Read file's base 64 into variable.
          const image = fs.readFileSync(tempfile, {encoding: 'base64'});

          /*// Update the currentTrack;
          currentTrack = {
            track: response.name,
            artist: response.artist,
            album: response.album.name,
            artwork: image
          };*/
        
          // Let the overlay know the track changed.
          emitNowPlaying(currentTrack);
        });

      }
      else {
        console.log("nowplaying-win.js | Couldn't find an album art.");

        /*// Update the currentTrack;
        currentTrack = {
          track: response.name,
          artist: response.artist,
          album: response.album.name,
          artwork: ''
        };*/
  
        // Let the overlay know the track changed.
        emitNowPlaying(currentTrack);
      }
    })

    // getNowPlaying loops forever. Check if the track's changed in another second or two.
    setTimeout(getNowPlaying, 2000);
  }

  // Kick things off initially.
  getNowPlaying();
}