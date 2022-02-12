import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    userReminderId: Number,
    messengerId: String,
    date: String,
    time: String,
    event: String,
    timeInUTC: String
});

export default mongoose.model('test', reminderSchema);