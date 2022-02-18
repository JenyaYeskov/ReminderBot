import Reminder from "./reminderSchema.js";

class mongoWithMongooseDB {
    async find(data) {
        return Reminder.find(data);
    }

    createNew(data) {

    }

    findOneAndDelete(data) {

    }

    deleteMany(data) {

    }
}

export default new mongoWithMongooseDB();