// import "dotenv/config";
import pg from "pg";
import "dotenv/config"

const clientClass = pg.Client;

// const client = new clientClass("postgres://gmlatebk:wlTVetyD86nERrzISLsDEFE9cSAVio0Q@abul.db.elephantsql.com/gmlatebk");

async function getConnection() {
    return new clientClass("postgres://gmlatebk:wlTVetyD86nERrzISLsDEFE9cSAVio0Q@abul.db.elephantsql.com/gmlatebk")
}

class postgres {

    async find(data) {
        let connection = await getConnection();

        try {
            await connection.connect();

            let result = await connection.query(`SELECT * FROM reminders WHERE "messenger user id" = $1`, [data["messenger user id"]]);

            return result.rows;

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async createNew(data) {
        let connection = await getConnection();
        let {dateInput, timeInput, event, time, userReminderId} = data;
        let uid = data["messenger user id"];

        try {
            await connection.connect();

            let result = await connection.query(
                `INSERT INTO reminders ("dateInput", "timeInput", event, time, "userReminderId", "messenger user id") 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [dateInput, timeInput, event, time, userReminderId, uid]);

            return result.rows[0];

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async findOneAndDelete(data) {
        let connection = await getConnection();

        try {
            await connection.connect();

            if (data.id) {
                let result = await connection.query(`DELETE FROM reminders WHERE "id" = $1 RETURNING *`, [data.id]);

                return result.rows[0];
            }

            let result = await connection.query(`DELETE FROM reminders WHERE "messenger user id" = $1 AND "userReminderId" = $2 RETURNING *`,
                [data["messenger user id"], data.userReminderId]);

            return result.rows[0];

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async deleteMany(data) {
        let connection = await getConnection();

        try {
            await connection.connect();

            let result = await connection.query(`DELETE FROM reminders WHERE "messenger user id" = $1 RETURNING *`,
                [data["messenger user id"]]);

            return {deletedCount: result.rowCount};

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async getAll() {

    }

    async findByIdAndUpdate(id, data) {

    }
}

export default new postgres();