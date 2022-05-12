import supertest from "supertest";
import app from "../app.js";

describe("gsdgd", () =>{
    test("hui", async () => {
        let res = await supertest(app).post("/reminders/getRems").send({
            "amount": "all",
            "messenger user id": "1844369452275489"
        })

        expect(res.statusCode).toBe(200);
    })
})
