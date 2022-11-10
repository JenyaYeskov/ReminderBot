import reminderService from "../models/reminderService.js";
import reminderView from "../view/reminderView.js";

class ReminderController {
    async handleRequest(method, req, res, next) {
        try {
            const data = await method(req.body);

            if (!data) {
                return res.end();
            }

            if (data.statusCode) {
                res.status(data.statusCode);
            }

            return res.send(reminderView.showResponse(data));

        } catch (err) {
            next(err);
        }
    }

    getReminders(req, res, next) {
        return this.handleRequest(reminderService.getReminders, req, res, next);
    }

    createReminder(req, res, next) {
        return this.handleRequest(reminderService.createReminder, req, res, next);
    }

    deleteReminder(req, res, next) {
        return this.handleRequest(reminderService.deleteReminder, req, res, next);
    }

    acceptOrSnoozeReminder(req, res, next) {
        return this.handleRequest(reminderService.acceptOrSnoozeReminder.bind(reminderService), req, res, next);
    }
}

export default new ReminderController();