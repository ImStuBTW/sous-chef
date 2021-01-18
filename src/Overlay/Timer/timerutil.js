class TimerUtil {
    // Extract just core timer details.
    static extractTimerInfo(streamTimer) {
        return {
            id: streamTimer.id,
            name: streamTimer.name,
            seconds: streamTimer.getSeconds()
        };
    }

    // Lookup a timer instance based on its id. Returns the index
    // or -1 if not found.
    static getTimerIndexWithId(timers, id) {
        return timers.findIndex((timer) => {
            return timer.id === id;
        });
    }
}

export default TimerUtil;