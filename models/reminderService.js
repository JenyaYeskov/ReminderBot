import reminderDB from "./mongoDbWithMongoose.js";
import Utils from "./reminderUtils.js";
import ApiError from "../Errors/apiError.js";

class ReminderService {

    async getReminders(data) {
        if (data.amount.toLowerCase() === "todays") {
            const today = new Date();

            let reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});
            reminders = reminders.filter((reminder) => Utils.isToday(reminder.time));

            return Utils.whetherRemindersFound(reminders, "You have no reminders for today.")

            if (reminders.length > 0) {
                return reminders;
            } else return "You have no reminders for today."

            const reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});

            return Utils.whetherRemindersFound(reminders, "You have no reminders.")

        } else throw new ApiError(400, "Invalid input.")
    }

    async createReminder(data) {
        data.userReminderId = await Utils.getNewId(data["messenger user id"]);
        data.time = await Utils.getReminderTime(data.dateInput, data.timeInput, data.timezone);

        const result = await reminderDB.createNew(data);
        result.statusCode = 201;

        return result;
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
        try {
            const reminders = await reminderDB.getAll();

            for (const reminder of reminders) {
                if (reminder.time <= new Date()) {
                    await this.acceptOrSnoozeReminder(reminder)
                }
            }
        } catch (e) {
            console.error(e);
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

        const snoozedReminder = await reminderDB.findByIdAndUpdate(DBReminderID, {time: newTime});
        return `Reminder "${snoozedReminder.event}" will show up in 10 minutes.`;
    }

    async acceptReminder(DBReminderID) {
        const deletedReminder = await reminderDB.findOneAndDelete({id: DBReminderID});
        return `Reminder "${deletedReminder.event}" was deleted.`;
    }

}

export default new ReminderService();
