import reminderService from "./reminderService.js";

let interval;

class controlService {
    start() {
        clearInterval(interval);

        interval = setInterval(() => {
            reminderService.checkReminder();
        }, 10000);

        console.log('started');
        return('started');
    }

    stop() {
        clearInterval(interval);

        console.log('stopped');
        return('stopped');
    }
}

export default new controlService();

