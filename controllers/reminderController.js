import reminderService from "../models/reminderService.js";
class ReminderController {

    async getReminders(req, res) {
        try {
            const reminders = await reminderService.getReminders(req.body);
            res.send(reminders);
        } catch (e) {
            console.error(e.message);
            res.status(500).send(e.message);
        }

    }

    async createReminder(req, res) {
        try {
            const reminder = await reminderService.createReminder(req.body);
            res.send(reminder);
        } catch (e) {
            console.error(e.message);
            res.status(500).send(e.message);
        }

    }

     async deleteReminder(req, res) {
         try {
             const reminder = await reminderService.deleteReminder(req.body);
             res.send(reminder);
         } catch (e) {
             console.error(e.message);
             res.status(500).send(e.message);
         }
    }

}

export default new ReminderController();