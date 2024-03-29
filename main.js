// Require Electron for app window.
// isDev toggles some dev mode checks.
// path is a helper function for relative file locations.
const { app, BrowserWindow, globalShortcut, shell } = require("electron");
const contextMenu = require('electron-context-menu');
const isDev = require("electron-is-dev");
const path = require("path");

// Require Express for API and Frontend server.
const express = require('express');
const frontendApp = express();
const backendApp = express();
const backendServer = require('http').createServer(backendApp);

// Set the application's port.
let frontendPort = '3000';
if(!isDev) { frontendPort = 80; }
const backendPort = '3001';

// Initialize Socket.io Instances
// First, boost the max listeners to avoid warnings.
// Main io instance used to send communications out to connected clients.
// clientio and clientSocket instances used to send messages from the sever, to the server.
// This aids in inter-app communication, but is not needed for most plugins.
require('events').EventEmitter.defaultMaxListeners = 24;
const io = require('socket.io')(backendServer, {cors: {origin: '*'} });
let clientio = require('socket.io-client');
let clientSocket = clientio('http://localhost:' + backendPort);

// Require plugins, passing the socket io connection.
require('./plugins/banner.js')(io); // Show info banners.
require('./plugins/botmessages.js')(io); // Handle Twitch bot messages.
require('./plugins/image.js')(io); // Show images.
require('./plugins/probe.js')(io); // Show temperature probe.
require('./plugins/recipe.js')(io); // Show recipe info.
require('./plugins/timer.js')(io); // Handle cooking timers.
require('./plugins/tweet.js')(io); // Show Twitter embeds.
require('./plugins/utility.js')(io, frontendPort); // Show Twitter embeds.

// Require plugins that need the inter-app client io socket.
require('./plugins/bubbles.js')(io, clientSocket); // Show drink bubble overlay.
require('./plugins/confetti.js')(io, clientSocket); // Show confetti overlay.
require('./plugins/notice.js')(io, clientSocket); // Get user's attention??? TODO: Verify Functionality
require('./plugins/obs.js')(io, clientSocket); // Handle OBS scene transitions.
require('./plugins/trivia.js')(io, clientSocket); // Handle Twitch Trivia Bot
require('./plugins/twitch.js')(io, clientSocket); // Handle Twitch integration.

// Actviate iTunes media plugin based on OS.
if (process.platform === 'darwin') { require('./plugins/nowplaying-mac.js')(io); }
if (process.platform === 'win32') { require('./plugins/nowplaying-win.js')(io); }

// Advertise over Bonjour/Zeroconf/MDNS that the app can be accessed at http://souschef.local
var bonjour = require('bonjour')();
const bonjourUrl = 'souschef.local';
bonjour.publish({ name: 'Sous Chef', host: bonjourUrl, type: 'http', port: 80})

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

// Load React Dev Tools if running in dev mode.
if(isDev && process.platform !== 'win32') {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if(require("electron-squirrel-startup")) {
  app.quit();
}

/******* Electron Code *******/

// Create a context menu for right click pasting.
contextMenu({
	prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'Rainbow',
			// Only show it when right-clicking images
			visible: parameters.mediaType === 'image'
		}
	]
});

function createWindow() {
  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 356,
    height: 950,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      allowFileAccess: true,
			spellcheck: true
    }
  });

  // Ditch the menu bar if on Windows.
  if (process.platform === 'win32') { mainWindow.removeMenu(); }

  // Load the Create-React-App localhost if in dev mode,
  // otherwise, load from Express app.
  mainWindow.loadURL("http://localhost:" + frontendPort);

  // If in dev mode, ait until the web contents have loaded before opening dev tools.
  if (isDev) {
    mainWindow.webContents.once('did-frame-finish-load', () => {
      // Automatically pop out the dev tools.
        mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }

  // Create handler for opening links in external browser.
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
};

// Create the main window when the app's ready.
// Also install the React Dev Tools at this time if needed.
app.on('ready', () => {
  createWindow();

  if(isDev && process.platform !== 'win32') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.log(`An error occurred: , ${error}`));
  }
});

// Unregister all global hotkeys when application is about ot quit.
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/******* Express Code *******/

// Serve frontend pages unless in dev mode.
if(!isDev) {
  frontendApp.use(express.static(path.join(__dirname, 'build')));
  frontendApp.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });
  frontendApp.listen(frontendPort);
  console.log('Frontend serving on http://localhost:' + frontendPort);
  console.log('Frontend serving on http://' + bonjourUrl + ':' + frontendPort);
}

// Start Express Server
backendServer.listen(backendPort, () => {
  console.log('Backend listening on http://localhost:' + backendPort);
  console.log('Backend listening on http://' + bonjourUrl + ':' + backendPort);
});