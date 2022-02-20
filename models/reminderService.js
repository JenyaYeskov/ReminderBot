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
            let timeString = `${date}T${time} ${this.formatOffset(offset)}`;

            if (DateAndTime.isValid(timeString, `${pattern} Z`)) {
                return DateAndTime.parse(timeString, `${pattern} Z`);
            }
        }
    }

    async createReminder(data) {
        data.userReminderId = await this.getNewId(data["messenger user id"]);
        data.time = await this.getTime(data.dateInput, data.timeInput, data.timezone);

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

    formatOffset(offset) {
        const separators = [".", ":", "/"];

        for (const separator of separators) {
            if (offset.includes(separator)) {
                offset = offset.split(separator).join("");
                break;
            }
        }

        let sign;
        if (offset >= 0) {
            sign = "+";
        } else {
            sign = "-";
            offset = offset.slice(1);
        }

        if (offset.length === 1) {
            return `${sign}0${offset}00`
        } else if (offset.length === 2) {
            return `${sign}${offset}00`
        } else if (offset.length === 3) {
            return `${sign}0${offset}`
        } else if (offset.length === 4) {
            return `${sign}${offset}`
        }
    }
}

export default new ReminderService();
