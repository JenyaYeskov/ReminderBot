import {jest} from '@jest/globals';
import reminderDB from "../models/mongoDbWithMongoose.js";
import controlService from "../models/controlService.js";
import reminderService from "../models/reminderService.js";

describe("", () => {
    jest.setTimeout(10000);

    jest.useFakeTimers();
    it('should check if reminders time has come', async () => {

        let now = new Date();
        let reminderData = [{
            event: "some event",
            "_id": "someId",
            "time": now
        }, {
            event: "another event",
            "_id": "anotherId",
            "time": new Date().setHours(now.getHours() + 1)
        }];

        reminderDB.getAll = jest.fn().mockImplementation(async () => {
            return reminderData;
        });

        reminderService.acceptOrSnoozeReminder = jest.fn().mockImplementation(async (data) => {
            return `time to ${data.event}`;
        });


        controlService.start(5000);

        expect(reminderDB.getAll).not.toBeCalled();

        jest.advanceTimersByTime(6000);

        expect(reminderDB.getAll).toBeCalled();
        // expect(reminderService.acceptOrSnoozeReminder.mock.results[0]).toEqual(`time to ${reminderData[0].event}`)
    });
})