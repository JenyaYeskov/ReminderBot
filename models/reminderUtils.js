import reminderService from "./reminderService.js";
import DateAndTime from "date-and-time";
import two_digit_year from "date-and-time/plugin/two-digit-year";
import ApiError from "../Errors/apiError.js";
import axios from "axios";

DateAndTime.plugin(two_digit_year);

class ReminderUtils {
    dateAndTimePatterns = ['DD.MM.YYYY HH.mm', 'D.MM.YYYY HH.mm', 'DD.MM.YYYY H.mm',
        'D.MM.YYYY H.mm', 'DD.MM.YY HH.mm', 'D.MM.YY HH.mm', 'DD.MM.YY H.mm', 'D.MM.YY H.mm',
        'DD.M.YYYY HH.mm', 'D.M.YYYY HH.mm', 'DD.M.YYYY H.mm', 'D.M.YYYY H.mm', 'DD.M.YY HH.mm',
        'D.M.YY HH.mm', 'DD.M.YY H.mm', 'D.M.YY H.mm', 'DD.MM.YYYY HH.m', 'D.MM.YYYY HH.m', 'DD.MM.YYYY H.m',
        'D.MM.YYYY H.m', 'DD.MM.YY HH.m', 'D.MM.YY HH.m', 'DD.MM.YY H.m', 'D.MM.YY H.m',
        'DD.M.YYYY HH.m', 'D.M.YYYY HH.m', 'DD.M.YYYY H.m', 'D.M.YYYY H.m', 'DD.M.YY HH.m',
        'D.M.YY HH.m', 'DD.M.YY H.m', 'D.M.YY H.m'];

    async getReminderTime(date, time, offset) {
        let result;

        for (const pattern of this.dateAndTimePatterns) {
            let timeString = `${date}T${time} ${this.formatOffset(offset)}`;

            if (DateAndTime.isValid(timeString, `${pattern} Z`)) {
                result = DateAndTime.parse(timeString, `${pattern} Z`);
            }
        }
        if (result) {
            return result;
        } else throw new ApiError(400, "Wrong date or time.")
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

    async getNewId(messengerId) {
        let reminders = await reminderService.getReminders({"messenger user id": messengerId, amount: "all"});
        reminders = Array.from(reminders)
        const existingIDs = reminders.map((reminder) => reminder.userReminderId);

        let id = 1;

        while (existingIDs.includes(id)) {
            id += 1;
        }

        return id;
    }

    isToday(day) {
        return DateAndTime.isSameDay(new Date(), day);
    }

    async whetherRemindersFound(reminders, message) {
        if (reminders[0]) {
            return reminders;
        } else return message
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
}

export default new ReminderUtils();