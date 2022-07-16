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
        const {dateInput, timeInput, event, time, userReminderId, "messenger user id": uid} = data;
        const queryData = [dateInput, timeInput, event, time, userReminderId, uid];

        const queryString = `INSERT INTO reminders ("dateInput", "timeInput", event, time, "userReminderId", "messenger user id") 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const result = await this.doRequest(queryString, queryData);

        return result.rows[0];
    }

    async findOneAndDelete(data) {
        let queryString;

        if (data.id) {
            queryString = `DELETE FROM reminders WHERE "id" = $1 RETURNING *`;

            const result = await this.doRequest(queryString, [data.id]);

            return result.rows[0];
        }

        queryString = `DELETE FROM reminders WHERE "messenger user id" = $1 AND "userReminderId" = $2 RETURNING *`;

        const result = await this.doRequest(queryString, [data["messenger user id"], data.userReminderId]);

        return result.rows[0];
    }

    async deleteMany(data) {
        const queryString = `DELETE FROM reminders WHERE "messenger user id" = $1 RETURNING *`;

        const result = await this.doRequest(queryString, [data["messenger user id"]]);

        return {deletedCount: result.rowCount};
    }

    async getAll() {

        const result = await this.doRequest(`SELECT * FROM reminders`);

        return result.rows;
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