import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import {MongooseConnection} from "../config/mongooseConnection.js";

let reminderInfo = {
    "dateInput": "23.03.22",
    "messenger user id": process.env.fbMessengerId,
    "timeInput": "05.10",
    "timezone": "2",
    "event": "do something"
}

beforeAll(async () => {
    const mongoConnection = new MongooseConnection("mongo testing connection", process.env.MONGO_TEST_URI);

    try {
        await mongoConnection.connect();
    } catch (e) {
        console.error(e);
    }
})

beforeEach(async () => {
    await supertest(app).post("/reminders/delete").send({
        "userReminderId": "",
        "messenger user id": process.env.fbMessengerId,
        "amount": "all"
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe("Reminder routes testing", () => {

    describe("/reminders/addRem route tests", () => {

        it("should return status code 201", async () => {
            const response = await supertest(app).post("/reminders/addRem").send(reminderInfo)

            expect(response.statusCode).toBe(201);

        })

        it('should create new reminder in the db, and return reminder info', async () => {
            const response = await supertest(app).post("/reminders/addRem").send(reminderInfo);

            expect(response.body).toEqual({
                "userReminderId": expect.any(Number),
                "messenger user id": process.env.fbMessengerId,
                "dateInput": "23.03.22",
                "timeInput": "05.10",
                "event": "do something",
                "time": "2022-03-23T03:10:00.000Z",
                "_id": expect.any(String),
                "__v": 0
            })
        });
    })

    describe("/reminders/getRems route tests", () => {
        let today = new Date();

        it("should return status code 200 ", async () => {
            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            })

            expect(response.statusCode).toBe(200);
        });

        it("should return all created reminders info", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            })

            expect(response.body.length).toBe(3);

            for (let i = 0; i < response.body.length; i++) {
                expect(response.body[i]).toEqual({
                    "_id": expect.any(String),
                    "userReminderId": i + 1,
                    "messenger user id": process.env.fbMessengerId,
                    "dateInput": "23.03.22",
                    "timeInput": "05.10",
                    "event": "do something",
                    "time": "2022-03-23T03:10:00.000Z",
                    "__v": 0
                })
            }

        });

        it("should return today's reminders info", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);

                let newInfo = Object.assign({}, reminderInfo);
                newInfo.dateInput = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

                await supertest(app).post("/reminders/addRem").send(newInfo);
            }

            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "todays",
                "messenger user id": process.env.fbMessengerId
            })

            expect(response.body.length).toBe(3);

            let id = 0
            for (let i = 0; i < response.body.length; i++) {
                id += 2;

                expect(response.body[i]).toEqual({
                    "_id": expect.any(String),
                    "userReminderId": id,
                    "messenger user id": process.env.fbMessengerId,
                    "dateInput": `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                    "timeInput": "05.10",
                    "event": "do something",
                    "time": expect.any(String),
                    "__v": 0
                })

                expect(new Date(response.body[i].time).toDateString()).toBe(today.toDateString());
            }

        });
    });

    describe("/reminders/delete route tests", () => {

        it("should delete all user's reminders from db", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            let response = await supertest(app).post("/reminders/delete").send({
                "messenger user id": process.env.fbMessengerId,
                "amount": "all"
            })

            expect(response.body.deletedCount).toBe(3);

            response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            })

            expect(response.body.length).toBe(0)
        });

        it("should delete only one reminder from db by id", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            let response = await supertest(app).post("/reminders/delete").send({
                "userReminderId": "2",
                "messenger user id": process.env.fbMessengerId,
                "amount": "one"
            })

            expect(response.body.userReminderId).toBe(2);

            response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": process.env.fbMessengerId
            })

            expect(response.body.length).toBe(2)

            for (const reminder of response.body) {
                expect(response.userReminderId).not.toBe(2);
            }
        });
    });

})
