# Sous Chef Twitch Overlay

Sous Chef is Twitch overlay designed to aid in cooking streams. It supports multiple camera views, recipe and drink labels, multiple countdown timers, image and Tweet embeds, as well as the ability to display realtime temperature probe information.

# How to Use

Download and launch the Mac or Windows executable in the /dist folder. The app's control panel should appear. This page can also be viewed on your local network by browsing to your computer's IP address, or using http://souschef.local if your computer has Bonjour services / Zeroconf enabled.

The Twitch overlay can be viewed and configured for OBS at http://souschef.local/overlay and http://souschef.local/overlay-novideo

# How to Develop

Clone the Github repository to your local computer. Install the application's dependencies with `npm install`, then run the app with `npm run dev`. The Sous Chef application is split into two portions: A Create-React-App frontend, and a Electron/Express backend. If for some reason you need to run one of these pieces in isolation, `npm start` kicks off the frontend startup script, and `npm run electron` starts the boots the backend. When you're ready to compile the application, run `npm run package` to kick off Electron Froge's packaging script.

This application layout is based off of [Mandi Wise' Dev.to post](https://dev.to/mandiwise/electron-apps-made-easy-with-create-react-app-and-electron-forge-560e).

Create React App has hot-reloading packages, which is pretty spiffy.