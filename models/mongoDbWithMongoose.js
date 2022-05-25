import Reminder from "./reminderSchema.js";

class mongoDbWithMongoose {
    async find(data) {
        return Reminder.find(data).lean();
    }

    async createNew(data) {
        const reminder = await new Reminder({...data});
        await reminder.save();

        return reminder;
    }

    async findOneAndDelete(data) {
        return Reminder.findOneAndDelete(data).lean();
    }

    async deleteMany(data) {
        return Reminder.deleteMany(data).lean();
    }

    async getAll() {
        return this.find();
    }

    async findByIdAndUpdate(id, data) {
        return Reminder.findByIdAndUpdate(id, data).lean();
    }
}

export default new mongoDbWithMongoose();