import pg from "pg";
import "dotenv/config"

const clientClass = pg.Client;

async function getConnection() {
    try {
        return new clientClass(process.env.POSTGRES_URL);
    } catch (e) {
        throw e;
    }
}

class postgres {

    async doRequest(query, queryData) {
        const connection = await getConnection();

        try {
            await connection.connect();

            return queryData ? await connection.query(query, [...queryData]) : await connection.query(query);

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async find(data) {
        const queryString = `SELECT * FROM reminders WHERE "messenger user id" = $1`;

        let result = await this.doRequest(queryString, [data["messenger user id"]]);

        return result.rows;
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
        let connection = await getConnection();

        try {
            await connection.connect();

            let rems = await connection.query(`SELECT * FROM reminders`);

            return rems.rows;

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }

    async findByIdAndUpdate(id, data) {
        let connection = await getConnection();

        try {
            await connection.connect();

            let rems = await connection.query(`UPDATE reminders SET "time" = $1 WHERE "id" = $2 RETURNING *`, [data.time, id]);

            return rems.rows[0];

        } catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }
}

export default new postgres();