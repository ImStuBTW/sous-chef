let EasyTimer = require('easytimer.js');

// Class to encapsulate common timer functions.
module.exports = class StreamTimer {

    // Create and start timer when this object is created.
    constructor(id, name, seconds, updateCallback, expiredCallback) {
        this.id = id;
        this.name = name;
        this.timer = new EasyTimer.Timer();
        this.originalSeconds = parseInt(seconds);
        this.updateCallback = updateCallback;
        this.expiredCallback = expiredCallback;

        this.timer.addEventListener('secondsUpdated', this.updateSeconds.bind(this));
        this.timer.addEventListener('targetAchieved', this.targetAchieved.bind(this));
        this.timer.start({countdown: true, startValues: {seconds: parseInt(seconds)}});
    }
    
    // Extract info from timer and send to callback if one is provided.
    updateSeconds(event) {
        let timeValues = this.timer.getTimeValues(),
            seconds = (timeValues.minutes * 60) + timeValues.seconds;

        if (this.updateCallback) {
            this.updateCallback(this.id, this.name, seconds, event);
        }
    }

    targetAchieved(event) {
        if (this.expiredCallback) {
            this.expiredCallback(this.id);
        }
    }

    // Retrieve remaining seconds on the timer.
    getSeconds() {
        let timeValues = this.timer.getTimeValues();
        return (timeValues.hours * 3600) + (timeValues.minutes * 60) + timeValues.seconds;
    }

    getOriginalSeconds() {
        return this.originalSeconds;
    }

    // Stop the timer. Event will no longer fire.
    stopTimer() {
        this.timer.stop();
    }

    // Stop the timer and remove event listener.
    // This should only be done once the timer is no longer needed.
    disposeTimer() {
        this.stopTimer();
        this.timer.removeEventListener('secondsUpdated', this.updateSeconds);
        this.timer.removeEventListener('targetAchieved', this.targetAchieved);
    }

    // Repeat the timer. Reset will return the timer to the
    // state it was in when first constructed.
    repeatTimer() {
        this.timer.reset();
    }

}