import express from "express";
import reminderController from "../controllers/reminderController.js";

const router = express.Router();

router.get('/getRems', reminderController.getReminders);

router.post('/addRem', reminderController.createReminder);

router.post('/delete', reminderController.deleteReminder);

// router.post('/acceptOrSnooze', reminderController.acceptOrSnooze);

export default router;