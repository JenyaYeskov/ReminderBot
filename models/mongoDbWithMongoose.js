import Reminder from "./mongooseReminderSchema.js";

class mongoDbWithMongoose {
    async find(data) {
        return Reminder.find(data);
    }

    async createNew(data) {
        const reminder = await new Reminder({...data});
        await reminder.save();

        return reminder;
    }

    async findOneAndDelete(data) {
        return Reminder.findOneAndDelete(data);
    }

    async deleteMany(data) {
        return Reminder.deleteMany(data);
    }

    async getAll() {
        return this.find();
    }
}

export default new mongoDbWithMongoose();