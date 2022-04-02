import reminderService from "../models/reminderService.js";

class ReminderController {
    async handleRequest(method, req, res, next) {
        try {
            const data = await method(req.body);
            return res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    async getReminders(req, res) {
        try {
            const reminders = await reminderService.getReminders(req.body);
            res.send(reminders);
        } catch (e) {
            console.error(e.message);
            res.status(500).send(e.message);
        }

    }

    async createReminder(req, res, next) {
        return this.handleRequest(reminderService.createReminder, req, res, next);
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

    async acceptOrSnoozeReminder(req, res) {
        try {
            const reminder = await reminderService.acceptOrSnoozeReminder(req.body);
            res.send(reminder);
        } catch (e) {
            console.error(e.message);
            res.status(500).send(e.message);
        }
    }

}

export default new ReminderController();