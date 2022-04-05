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

    async getReminders(req, res, next) {
        return this.handleRequest(reminderService.getReminders, req, res, next);
    }

    async createReminder(req, res, next) {
        return this.handleRequest(reminderService.createReminder, req, res, next);
    }

     async deleteReminder(req, res, next) {
         return this.handleRequest(reminderService.deleteReminder, req, res, next);
    }

    async acceptOrSnoozeReminder(req, res, next) {
        return this.handleRequest(reminderService.acceptOrSnoozeReminder, req, res, next);
    }
}

export default new ReminderController();