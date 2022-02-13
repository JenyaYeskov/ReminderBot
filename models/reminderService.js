import Reminder from "./reminderSchema.js";

class ReminderService {

    async getReminder(data) {
        if (data.todays.toLowerCase() === "todays") {
            return Reminder.find({"messenger user id": data["messenger user id"]});  //TODO
        }
        else if (data.todays.toLowerCase() === "all") {
            return Reminder.find({"messenger user id": data["messenger user id"]});
        }
        else return "Invalid input"

    }

    async createReminder(data) {
        const reminder = await new Reminder({...data});
        reminder.save();
        console.log(reminder);
        return reminder;
    }

    async deleteReminder(data) {
        // Reminder.findOneAndRemove({...data});
        const reminder = await Reminder.findOneAndDelete({...data});

        console.log(reminder);
        return reminder;

    }

    async acceptOrSnoozeReminder(data) {

    }
}

export default new ReminderService();

