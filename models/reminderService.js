import "dotenv/config";
import reminderDB from "./mongoWithMongoose.js";
// import reminderDB from "./postgres.js";
import Utils from "./reminderUtils.js";
import ApiError from "../Errors/apiError.js";

class ReminderService {

    async getReminders(data) {
        const amount = data.amount.toLowerCase().trim();

        if (amount === "today's" || amount === "todays" || amount === "today") {

            let reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});
            reminders = reminders.filter((reminder) => Utils.isToday(reminder.time));

            return Utils.whetherRemindersFound(reminders, "You have no reminders for today.");
        }

        if (amount === "all") {

            const reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});

            return Utils.whetherRemindersFound(reminders, "You have no reminders.");
        }

        throw new ApiError(400, "Invalid input.")
    }

    async createReminder(data) {
        data.userReminderId = await Utils.getNewId(data["messenger user id"]);
        data.time = await Utils.getReminderTime(data.dateInput.trim(), data.timeInput.trim(), data.timezone);

        if (data.time < new Date()) {
            throw new ApiError(400, "Sorry, can't remind you of something from the past.")
        }

        const result = await reminderDB.createNew(data);
        result.statusCode = 201;
        result.message = "was created."

        return result;
    }

    async deleteReminder(data) {
        const amount = data.amount.toLowerCase().trim();

        //Deleting single reminder
        if (amount === ("one" || 1) && !isNaN(data.userReminderId)) {
            let deleted = await reminderDB.findOneAndDelete({
                userReminderId: data.userReminderId,
                "messenger user id": data["messenger user id"]
            });

            let result = Utils.whetherRemindersFound([deleted], `You have no reminders with id ${data.userReminderId}`);

            if (Array.isArray(result)) {
                result = result[0];
                result.message = "was deleted.";
                return result;
            }

            return result;
        }

        //Deleting multiple reminders
        if (amount === "all") {
            let deleted = await reminderDB.deleteMany({"messenger user id": data["messenger user id"]});

            if (deleted.deletedCount > 0) {
                return `Deleted ${deleted.deletedCount} reminder(s). All your reminders have been deleted.`;
            }

            return `You have no reminders.`
        }

        throw new ApiError(400, "Invalid input.")
    }

    //Checks if reminder's time has come, and if so - activates the reminder.
    async checkReminder() {
        const reminders = await reminderDB.getAll();

        for (const reminder of reminders) {

            if (reminder.time <= new Date()) {
                this.activateReminder(reminder, `Hello! Time to ${reminder.event}!`)
                    .catch(err => console.error(err));
            }
        }
    }

    //Activates reminder by sending its data to certain chatfuel block.
    async activateReminder(reminder, message) {

        // Needed for different DBs compatibility
        const id = (reminder._id || reminder.id).toString();

        const url = `https://api.chatfuel.com/bots/${process.env.chatfuelBotId}/users/${reminder["messenger user id"]}/send?chatfuel_token=${process.env.chatfuel_token}&chatfuel_flow_name=Reminder_activation_flow&event=${message}&dbReminderId=${id}`;

        return Utils.sendMessage(url);
    }

    async acceptOrSnoozeReminder(data) {
        const {acceptOrSnooze, dbReminderId} = data;

        if (acceptOrSnooze.toLowerCase().trim() === "accept") {
            return (this.acceptReminder(dbReminderId));
        }

        if (acceptOrSnooze.toLowerCase().trim() === "snooze") {
            return (this.snoozeReminder(dbReminderId));
        }

        const reminder = await reminderDB.find({id: dbReminderId});

        await Utils.sendMessage(null, data["messenger user id"], "Invalid input. Please use buttons.");
        await this.activateReminder(reminder[0], `Time to ${reminder[0].event}!`);
    }

    //snoozes a reminder by adding 10 min. to its time.
    async snoozeReminder(DBReminderID) {
        const newTime = new Date();
        newTime.setMinutes(newTime.getMinutes() + 10);

        const snoozedReminder = await reminderDB.findByIdAndUpdate(DBReminderID, {time: newTime});
        return `Done. Reminder "${snoozedReminder.event}" will show up in 10 minutes.`;
    }

    async acceptReminder(DBReminderID) {
        const deletedReminder = await reminderDB.findOneAndDelete({id: DBReminderID});
        return `Done. Reminder "${deletedReminder.event}" was deleted.`;
    }
}

export default new ReminderService();
