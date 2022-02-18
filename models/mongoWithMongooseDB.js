import Reminder from "./reminderSchema.js";

class mongoWithMongooseDB {
    async find(data) {
        return Reminder.find(data);
    }

    async createNew(data) {
        const reminder = await new Reminder({...data});
        await reminder.save();

        return reminder;
    }

    findOneAndDelete(data) {

    }

    deleteMany(data) {

    }
}

export default new mongoWithMongooseDB();