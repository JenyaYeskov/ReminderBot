import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    userReminderId: Number,
    "messenger user id": {
        type: String,
        required: true
    },
    dateInput: {
        type: String,
        required: true
    },
    timeInput: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

export default mongoose.model('reminders', ReminderSchema);