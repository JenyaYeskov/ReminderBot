import reminderDB from "./mongoDbWithMongoose.js";

class ReminderService {

    async getReminders(data) {
        if (data.amount.toLowerCase() === "todays") {
            return await reminderDB.find({"messenger user id": data["messenger user id"]});  //TODO
        } else if (data.amount.toLowerCase() === "all") {
            return await reminderDB.find({"messenger user id": data["messenger user id"]});
        } else return "Invalid input"

    }

    async createReminder(data) {
        data.userReminderId = await this.getNewId(data["messenger user id"]);

        return await reminderDB.createNew(data);
    }

    async getNewId(messengerId) {
        const reminders = await this.getReminders({"messenger user id": messengerId, amount: "all"});
        const existingIDs = reminders.map((reminder) => reminder.userReminderId);

        let id = 1;

        while (existingIDs.includes(id)) {
            id += 1;
        }

        return id;
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
}

export default new ReminderService();

