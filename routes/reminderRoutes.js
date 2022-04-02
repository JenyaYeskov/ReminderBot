import express from "express";
import reminderController from "../controllers/reminderController.js";

const router = express.Router();

router.post('/getRems', reminderController.getReminders);

router.post('/addRem', reminderController.createReminder.bind(reminderController));
// router.post('/addRem', reminderController.createReminder);

router.post('/delete', reminderController.deleteReminder);

router.post('/acceptOrSnooze', reminderController.acceptOrSnoozeReminder);

export default router;