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

    async checkReminder() {
        const reminders = await reminderDB.getAll();

        for (const reminder of reminders) {

            if (reminder.time <= new Date()) {
                await this.acceptOrSnoozeReminder({
                    dbReminderId: reminder.id,
                    acceptOrSnooze: "snooze",
                    "messenger user id": ""
                })
            }
        }
    }

    acceptOrSnoozeReminder(data) {
        const {acceptOrSnooze} = data;
        const {dbReminderId} = data;

        if (acceptOrSnooze.toLowerCase() === 'accept') {
            return (this.acceptReminder(dbReminderId));
        } else if (acceptOrSnooze.toLowerCase() === 'snooze') {
            return (this.snoozeReminder(dbReminderId));
        }
    }

    async snoozeReminder(DBReminderID) {
        const newTime = new Date();
        newTime.setMinutes(newTime.getMinutes() + 10);

        await reminderDB.findByIdAndUpdate(DBReminderID, {time: newTime});

        return "snoozed";
    }

    async acceptReminder(DBReminderID) {
        await reminderDB.findOneAndDelete({id: DBReminderID});
        return "done   " + DBReminderID;
    }

}

export default new ReminderService();
