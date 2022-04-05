import express from "express";
import reminderController from "../controllers/reminderController.js";

const router = express.Router();

router.post('/getRems', reminderController.getReminders.bind(reminderController));

router.post('/addRem', reminderController.createReminder.bind(reminderController));

router.post('/delete', reminderController.deleteReminder.bind(reminderController));

router.post('/acceptOrSnooze', reminderController.acceptOrSnoozeReminder.bind(reminderController));

export default router;