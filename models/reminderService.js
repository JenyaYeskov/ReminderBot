import reminderDB from "./mongoDbWithMongoose.js";
import DateAndTime from "date-and-time"

const dateAndTimePatterns = ['DD.MM.YYYY HH.mm', 'D.MM.YYYY HH.mm', 'DD.MM.YYYY H.mm',
    'D.MM.YYYY H.mm', 'DD.MM.YY HH.mm', 'D.MM.YY HH.mm', 'DD.MM.YY H.mm', 'D.MM.YY H.mm',
    'DD.M.YYYY HH.mm', 'D.M.YYYY HH.mm', 'DD.M.YYYY H.mm', 'D.M.YYYY H.mm', 'DD.M.YY HH.mm',
    'D.M.YY HH.mm', 'DD.M.YY H.mm', 'D.M.YY H.mm'];

class ReminderService {

    async getReminders(data) {
        if (data.amount.toLowerCase() === "todays") {
            return await reminderDB.find({"messenger user id": data["messenger user id"]});  //TODO
        } else if (data.amount.toLowerCase() === "all") {
            return await reminderDB.find({"messenger user id": data["messenger user id"]});
        } else return "Invalid input"

    }

    async getTime(date, time, offset) {

        for (const pattern of dateAndTimePatterns) {
            if (DateAndTime.isValid(`${date} ${time} ${this.defineOffset(offset)}`, pattern)) {

            }
        }

    }

    async createReminder(data) {
        data.userReminderId = await this.getNewId(data["messenger user id"]);
        data.timeInUTC = await this.getTime(data.date, data.time, data.timezone);


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

    defineOffset(offset) {

    }
}

export default new ReminderService();
