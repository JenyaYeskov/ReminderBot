import reminderService from "../../models/reminderService.js";
import reminderDB from "../../models/mongoWithMongoose.js";
import {jest} from '@jest/globals';

let reminderInfo = {
    "dateInput": "23.03.22",
    "messenger user id": process.env.fbMessengerId,
    "timeInput": "05.10",
    "timezone": "2",
    "event": "do something"
}
let inf = {
    "messenger user id": process.env.fbMessengerId,
    "amount": "all"
};

describe("Reminder service tests", () => {
    describe("acceptOrSnooze method test", () => {

        it('should delete reminder if it was accepted', async function () {
            reminderDB.findOneAndDelete = jest.fn((data) => {
                return {"event": "get up"}
            });

            const response = await reminderService.acceptOrSnoozeReminder({
                dbReminderId: "12345678",
                acceptOrSnooze: "accept"
            });

            expect(reminderDB.findOneAndDelete).toBeCalledWith({"id": expect.any(String)});
            expect(response).toBe(`Done. Reminder "get up" was deleted.`);
        });

        it('should add 10 minutes to reminders time, when reminder is snoozed', async function () {
            reminderDB.findByIdAndUpdate = jest.fn((id, data) => {
                return {"event": "get up"}
            });

            const response = await reminderService.acceptOrSnoozeReminder({
                dbReminderId: "12345678",
                acceptOrSnooze: "snooze"
            });

            let time = new Date();
            time.setMinutes(time.getMinutes() + 10);

            expect(reminderDB.findByIdAndUpdate).toBeCalledWith(expect.any(String), {time: expect.any(Date)});
            expect(reminderDB.findByIdAndUpdate.mock.calls[0][1].time.toUTCString()).toEqual(time.toUTCString());
            expect(response).toBe(`Done. Reminder "get up" will show up in 10 minutes.`)
        });
    })
})
