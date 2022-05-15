import supertest from "supertest";
import app from "../app.js";

let reminderInfo = {
    "dateInput": "23.03.22",
    "messenger user id": "1844369452275489",
    "timeInput": "05.10",
    "timezone": "2",
    "event": "do something"
}

beforeEach(async () => {
    await supertest(app).post("/reminders/delete").send({
        "userReminderId": "",
        "messenger user id": "1844369452275489",
        "amount": "all"
    })
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
                "messenger user id": "1844369452275489",
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
                "messenger user id": "1844369452275489"
            })

            expect(response.statusCode).toBe(200);
        });

        it("should return all created reminders info", async () => {

            for (let i = 0; i < 3; i++) {
                await supertest(app).post("/reminders/addRem").send(reminderInfo);
            }

            const response = await supertest(app).post("/reminders/getRems").send({
                "amount": "all",
                "messenger user id": "1844369452275489"
            })

            expect(response.body.length).toBe(3);

            for (let i = 0; i < response.body.length; i++) {
                expect(response.body[i]).toEqual({
                    "_id": expect.any(String),
                    "userReminderId": i + 1 ,
                    "messenger user id": "1844369452275489",
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
                "messenger user id": "1844369452275489"
            })

            expect(response.body.length).toBe(3);

            let id = 0
            for (let i = 0; i < response.body.length; i++) {
                id += 2;

                expect(response.body[i]).toEqual({
                    "_id": expect.any(String),
                    "userReminderId": id ,
                    "messenger user id": "1844369452275489",
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

    // describe("/reminders/delete route tests", () => {
    //     it("should return status code 200 ", async () => {
    //         const response = await supertest(app).post("/reminders/getRems").send({
    //             "amount": "all",
    //             "messenger user id": "1844369452275489"
    //         })
    //
    //         expect(response.statusCode).toBe(200);
    //     });
    //
    //     it.skip("should return ", async () => {
    //
    //
    //         const response = await supertest(app).post("/reminders/getRems").send({
    //             "amount": "all",
    //             "messenger user id": "1844369452275489"
    //         })
    //
    //         expect(response.statusCode).toBe(200);
    //     });
    // });

})
