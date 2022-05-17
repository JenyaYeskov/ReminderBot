import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    userReminderId: Number,
    "messenger user id": String,
    dateInput: String,
    timeInput: String,
    event: String,
    time: Date
});

export default mongoose.model('reminders', ReminderSchema);