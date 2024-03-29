import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import {MongooseConnection} from "../config/mongooseConnection.js";

let responseTemplate;
let reminderInfo = {
    "dateInput": "",
    "messenger user id": process.env.fbMessengerId,
    "timeInput": "12.30",
    "timezone": "3",
    "event": "do something"
}

let today = new Date();
today.setSeconds(0, 0);

let future = new Date(today.getFullYear(), today.getMonth() + 1, 15, 12, 30);
future.setUTCHours(9);

reminderInfo.dateInput = `${future.getDate()}.${future.getMonth() + 1}.${future.getFullYear()}`;

beforeAll(async () => {
    const mongoConnection = new MongooseConnection("mongo testing connection", process.env.MONGO_TEST_URI);

    try {
        await mongoConnection.connect();
    } catch (e) {
        console.error(e);
    }
})

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    responseTemplate = [{"text": ""}];
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
})

describe("Reminder routes testing", () => {

    describe("/reminders/addRem route tests", () => {

        it("should return status code 201", async () => {
            const response = await supertest(app).post("/reminders/addRem").send(reminderInfo);

            expect(response.statusCode).toBe(201);
        })

        it('should create new reminder in the db, and return reminder info', async () => {
            const response = await supertest(app).post("/reminders/addRem").send(reminderInfo);

            responseTemplate[0].text = `Done. Reminder "${reminderInfo.event}" with id: 1 was created.`;
            expect(response.body).toEqual(responseTemplate);

            // expect(new Date(response.body.time)).toEqual(future)
            //
            // expect(response.body).toEqual({
            //     "messenger user id": reminderInfo["messenger user id"],
            //     "dateInput": reminderInfo.dateInput,
            //     "timeInput": reminderInfo.timeInput,
            //     "event": reminderInfo.event,
            //     "time": future.toISOString(),
            //     "userReminderId": 1,
            //     "_id": expect.any(String),
            //     "__v": expect.anything()
            // })
        });

        it("should return status code 400 and an error message when date input is wrong", async () => {
            let wrongDate = Object.assign({}, reminderInfo);
            wrongDate.dateInput = "wrong input";

            const response = await supertest(app).post("/reminders/addRem").send(wrongDate);

            expect(response.statusCode).toBe(400);
            responseTemplate[0].text = "Wrong date or time.";
            expect(response.body).toEqual(responseTemplate);
        })

        it("should return status code 400 and an error message when time input is wrong", async () => {
            let wrongTime = Object.assign({}, reminderInfo);
            wrongTime.timeInput = "wrong input";

            const response = await supertest(app).post("/reminders/addRem").send(wrongTime);

            expect(response.statusCode).toBe(400);
            responseTemplate[0].text = "Wrong date or time.";
            expect(response.body).toEqual(responseTemplate);
        })

        it("should return status code 400 and an error message when trying to set a reminder with a past time", async () => {
            let past = Object.assign({}, reminderInfo);
            past.dateInput = `${today.getDate()}.${today.getMonth() - 1}.${today.getFullYear()}`;

            const response = await supertest(app).post("/reminders/addRem").send(past);

            expect(response.statusCode).toBe(400);
            responseTemplate[0].text = "Sorry, can't remind you of something from the past.";
            expect(response.body).toEqual(responseTemplate);
        })

        it.skip("should return status code 500 and a server error message when no required info provided", async () => {
            const response = await supertest(app).post("/reminders/addRem").send();

            expect(response.statusCode).toBe(500);
            expect(response.text).toBe("Something went wrong, please try again.");
        })
    })

    describe("/reminders/getRems route tests", () => {

        it("should return status code 200 ", async () => {
            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            });

            expect(response.statusCode).toBe(200);
        });

        it("should return all created reminders info", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            });

            expect(response.body.length).toBe(3);

            for (let i = 0; i < response.body.length; i++) {

                expect(response.body[i]).toEqual({
                    "text":
                        `id: ${i + 1}\n"${reminderInfo.event}"\n${reminderInfo.dateInput} : ${reminderInfo.timeInput}`
                });

                // expect(response.body[i]).toEqual({
                //     "messenger user id": reminderInfo["messenger user id"],
                //     "dateInput": reminderInfo.dateInput,
                //     "timeInput": reminderInfo.timeInput,
                //     "event": reminderInfo.event,
                //     "time": future.toISOString(),
                //     "userReminderId": i + 1,
                //     "_id": expect.any(String),
                //     "__v": expect.anything()
                // })
            }
        });

        it("should return today's reminders info", async () => {
            let todayInfo;

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);

                todayInfo = Object.assign({}, reminderInfo);
                todayInfo.dateInput = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
                todayInfo.timeInput = `23.59`;

                await supertest(app).post("/reminders/addRem").send(todayInfo);
            }

            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "todays",
                "messenger user id": process.env.fbMessengerId
            });

            expect(response.body.length).toBe(3);

            let id = 0;
            let checkDate = new Date(today);
            checkDate.setHours(23);
            checkDate.setMinutes(59);

            for (let i = 0; i < response.body.length; i++) {
                id += 2;

                expect(response.body[i]).toEqual({
                    "text":
                        `id: ${id}\n"${todayInfo.event}"\n${todayInfo.dateInput} : ${todayInfo.timeInput}`
                });

                // expect(response.body[i]).toEqual({
                //     "messenger user id": todayInfo["messenger user id"],
                //     "dateInput": todayInfo.dateInput,
                //     "timeInput": todayInfo.timeInput,
                //     "event": todayInfo.event,
                //     "time": checkDate.toISOString(),
                //     "userReminderId": id,
                //     "_id": expect.any(String),
                //     "__v": expect.anything()
                // })

                // expect(new Date(response.body[i].time).toDateString()).toBe(today.toDateString());
            }
        });

        it("should return status code 400 and an error message when an amount input is unpredicted", async () => {
            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "wrong input",
                "messenger user id": process.env.fbMessengerId
            });

            expect(response.statusCode).toBe(400);
            responseTemplate[0].text = "Invalid input.";
            expect(response.body).toEqual(responseTemplate);
        })

        it.skip("should return status code 500 and a server error message when no required info provided", async () => {
            const response = await supertest(app).post("/reminders/addRem").send();

            expect(response.statusCode).toBe(500);
            expect(response.text).toBe("Something went wrong, please try again.");
        })
    });

    describe("/reminders/delete route tests", () => {

        it("should delete all user's reminders from db", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            let response = await supertest(app).post("/reminders/delete").send({
                "messenger user id": process.env.fbMessengerId,
                "amount": "all"
            });

            expect(response.statusCode).toBe(200);

            responseTemplate[0].text = "Deleted 3 reminder(s). All your reminders have been deleted.";
            expect(response.body).toEqual(responseTemplate);

            response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            });

            responseTemplate[0].text = "You have no reminders.";
            expect(response.body).toEqual(responseTemplate);
        });

        it("should delete only one reminder from db by id", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            let response = await supertest(app).post("/reminders/delete").send({
                "userReminderId": "2",
                "messenger user id": process.env.fbMessengerId,
                "amount": "one"
            });

            responseTemplate[0].text = `Done. Reminder "${reminderInfo.event}" with id: 2 was deleted.`;
            expect(response.body).toEqual(responseTemplate);

            response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            });

            expect(response.body.length).toBe(2);

            for (const reminder of response.body) {
                expect(response.userReminderId).not.toBe(2);
            }
        });

        it("should return status code 400 and an error message when an amount input is invalid", async () => {
            let response = await supertest(app).post("/reminders/delete").send({
                "messenger user id": process.env.fbMessengerId,
                "amount": "wrong input"
            });

            responseTemplate[0].text = "Invalid input.";
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(responseTemplate);
        })

        it("should return status code 400 and an error message when id input is invalid", async () => {
            let response = await supertest(app).post("/reminders/delete").send({
                "userReminderId": "wrong input",
                "messenger user id": process.env.fbMessengerId,
                "amount": "one"
            });

            responseTemplate[0].text = "Invalid input.";
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(responseTemplate);
        })

        it.skip("should return status code 500 and a server error message when no required info provided", async () => {
            const response = await supertest(app).post("/reminders/addRem").send();

            expect(response.statusCode).toBe(500);
            expect(response.text).toBe("Something went wrong, please try again.");
        })
    });

    describe("Wrong path test", () => {
        it("should return 404 status and 'not found' message when the pah is unknown", async () => {
            try {
                const response = supertest(app).get("/qwerty");

                expect(response.status).toBe(404);

                responseTemplate[0].text = "Not found.";
                expect(response.body).toEqual(responseTemplate);
            } catch (e) {
                console.error(e)
            }
        });
    })
})
