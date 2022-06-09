import "dotenv/config";
import reminderDB from "./mongoDbWithMongoose.js";
import Utils from "./reminderUtils.js";
import ApiError from "../Errors/apiError.js";
import axios from "axios";

class ReminderService {

    async getReminders(data) {
        if (data.amount.toLowerCase().trim() === "todays") {

            let reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});
            reminders = reminders.filter((reminder) => Utils.isToday(reminder.time));

            return Utils.whetherRemindersFound(reminders, "You have no reminders for today.")

        } else if (data.amount.toLowerCase().trim() === "all") {

            const reminders = await reminderDB.find({"messenger user id": data["messenger user id"]});

            return await Utils.whetherRemindersFound(reminders, "You have no reminders.")

        } else throw new ApiError(400, "Invalid input.")
    }

    async createReminder(data) {
        data.userReminderId = await Utils.getNewId(data["messenger user id"]);
        data.time = await Utils.getReminderTime(data.dateInput.trim(), data.timeInput.trim(), data.timezone);

        if (data.time < new Date()) {
            throw new ApiError(400, "Sorry, can't remind you of something from the past.")
        }

        const result = await reminderDB.createNew(data);
        result.statusCode = 201;

        return result;
    }

    async deleteReminder(data) {
        if (data.amount.toLowerCase().trim() === ("one" || 1) && !isNaN(data.userReminderId)) {
            let deleted = await reminderDB.findOneAndDelete({
                userReminderId: data.userReminderId,
                "messenger user id": data["messenger user id"]
            });

            return Utils.whetherRemindersFound([deleted], `You have no reminders with id ${data.userReminderId}`);
        } else if (data.amount.toLowerCase().trim() === "all") {
            let deleted = await reminderDB.deleteMany({"messenger user id": data["messenger user id"]});

            if (deleted.deletedCount > 0) {
                return `Deleted ${deleted.deletedCount} reminder(s). All your reminders have been deleted.`
            } else return `You have no reminders.`

        } else throw new ApiError(400, "Invalid input.")
    }

    async checkReminder() {
        try {
            const reminders = await reminderDB.getAll();

            for (const reminder of reminders) {
                if (reminder.time <= new Date()) {
                    return await this.activateReminder(reminder, `Hello! Time to ${reminder.event}!`)
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    async activateReminder(reminder, message) {
        let url = `https://api.chatfuel.com/bots/${process.env.chatfuelBotId}/users/${reminder["messenger user id"]}/send?chatfuel_token=${process.env.chatfuel_token}&chatfuel_flow_name=Reminder activation flow&event=${message}&dbReminderId=${reminder._id.toString()}`

        return this.sendMessage(url);
    }

    async sendMessage(url, user, message) {
        if (!url) {
            url = `https://api.chatfuel.com/bots/${process.env.chatfuelBotId}/users/${user}/send?chatfuel_token=${process.env.chatfuel_token}&chatfuel_flow_name=Message&message=${message}`
        }

        return axios({
            method: 'post',
            url: url,
            headers: {'Content-Type': 'application/json'}
        });
    }

    async acceptOrSnoozeReminder(data) {
        const {acceptOrSnooze, dbReminderId} = data;

        if (acceptOrSnooze.toLowerCase() === 'accept') {
            return (this.acceptReminder(dbReminderId));
        } else if (acceptOrSnooze.toLowerCase() === 'snooze') {
            return (this.snoozeReminder(dbReminderId));
        } else {
            this.sendMessage(null, data["messenger user id"], "Invalid input. Please use buttons.");

            let rem = await reminderDB.find({id: dbReminderId});

            return this.activateReminder(rem[0])
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
        return `Done. Reminder "${deletedReminder.event}" was deleted.`;
    }

}

export default new ReminderService();
