import reminderDB from "./mongoDbWithMongoose.js";
import DateAndTime from "date-and-time"
import Utils from "./reminderUtils.js";

class ReminderService {

    async getReminders(data) {
        if (data.amount.toLowerCase() === "todays") {
            const today = new Date();

            let reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});
            reminders = reminders.filter((reminder) => DateAndTime.isSameDay(today, reminder.time));

            return reminders;
        } else if (data.amount.toLowerCase() === "all") {
            return await reminderDB.find({"messenger user id": data["messenger user id"]});
        } else return "Invalid input"

    }

    async createReminder(data) {
        data.userReminderId = await Utils.getNewId(data["messenger user id"]);
        data.time = await Utils.getReminderTime(data.dateInput, data.timeInput, data.timezone);

        return await reminderDB.createNew(data);
    }

    async deleteReminder(data) {
        if (data.amount.toLowerCase() === ("one" || 1)) {
            return reminderDB.findOneAndDelete({
                userReminderId: data.userReminderId,
                "messenger user id": data["messenger user id"]
            });
        } else if (data.amount.toLowerCase() === "all") {
            return reminderDB.deleteMany({"messenger user id": data["messenger user id"]});
        } else return "Invalid input"
    }

    async acceptOrSnoozeReminder(data) {

    }

    checkReminder() {
        const reminders = reminderDB.find();

        for (const reminder of reminders) {
            if (reminder.time >= new Date()) {
                console.log("************");
            }
        }
    }

}

export default new ReminderService();
