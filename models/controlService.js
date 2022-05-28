import reminderService from "./reminderService.js";

let interval;

class controlService {
    start(time = 60000) {

        clearInterval(interval);

        interval = setInterval(async () => {
            await reminderService.checkReminder();
        }, time);

        return ("started");
    }

    stop() {
        clearInterval(interval);

        console.log("stopped");
        return ("stopped");
    }
}

export default new controlService();

