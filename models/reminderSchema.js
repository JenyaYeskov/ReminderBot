import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    name: String
});

export default mongoose.model('test', reminderSchema);