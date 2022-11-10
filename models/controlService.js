import reminderService from "./reminderService.js";

let interval;

class ControlService {

    //Runs reminders time check once per minute (unless another interval is set).
    start(time = 60000) {

        clearInterval(interval);

        interval = setInterval(async () => {
            try {
                await reminderService.checkReminder();
            } catch (e) {
                console.error(e);
            }
        }, time);

        return ("started");
    }

    //Stops reminders time check.
    stop() {
        clearInterval(interval);

        return ("stopped");
    }
}

export default new ControlService();

