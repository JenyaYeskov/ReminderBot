import Reminder from "./reminderSchema.js";

class ReminderService {

    async getReminder(data) {
        if (data.todays.toLowerCase() === "todays") {
            return Reminder.find({"messenger user id": data["messenger user id"]});  //TODO
        } else if (data.todays.toLowerCase() === "all") {
            return Reminder.find({"messenger user id": data["messenger user id"]});
        } else return "Invalid input"

    }

    async createReminder(data) {
        const reminder = await new Reminder({...data});
        // reminder.userReminderId = getNewId();                    // TODO

        await reminder.save();

        console.log(reminder);
        return reminder;
    }

    async deleteReminder(data) {

        if (data.amount.toLowerCase() === ("one" || 1)) {
            return Reminder.findOneAndDelete({
                userReminderId: data.userReminderId,
                "messenger user id": data["messenger user id"]
            });
        }
        else if (data.amount.toLowerCase() === "all") {
            return Reminder.deleteMany({"messenger user id": data["messenger user id"]});
        }
        else return "Invalid input"

    }

    async acceptOrSnoozeReminder(data) {

    }
}

export default new ReminderService();

