import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    userReminderId: Number,
    "messenger user id": String,
    date: String,
    time: String,
    event: String,
    timeInUTC: String
});

export default mongoose.model('test', ReminderSchema);