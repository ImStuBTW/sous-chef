const np = require("nowplaying-node"),
      fs = require('fs');

const NowPlaying = np.NowPlaying,
      PlayerName = np.PlayerName;

let trackPath;

module.exports = function(io) {
    // iTunes connection & event handling
    function fileToBase64(filePath) {
        let cover = fs.readFileSync(filePath, {encoding: 'base64'});
        fs.unlinkSync(filePath);
        return cover;
    }

    function emitNowPlaying(currentTrack) {
        console.log(`itunes-win.js | Playing: ${currentTrack.artist}, ${currentTrack.name}`);
        io.emit('itunes-playing', {
            track: currentTrack.name,
            artist: currentTrack.artist,
            album: currentTrack.album,
            artwork: currentTrack.artwork
        });
    }

    const iTunes = new NowPlaying({
        fetchCover: true,
        player: PlayerName.ITUNES
    });

    setInterval(() => {
        iTunes.update();
        let newPath = iTunes.getFilePath();

        if (newPath != trackPath) {
            let coverPath = iTunes.getCoverPath();
            trackPath = newPath;
            
            emitNowPlaying({
                name: iTunes.getTitle(),
                artist: iTunes.getArtist(),
                album: iTunes.getAlbum(),
                artwork: coverPath ? fileToBase64(coverPath) : null
            });
        }
    }, 1000);
};