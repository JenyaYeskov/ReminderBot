import pg from "pg";
import "dotenv/config"

const pool = new pg.Pool({connectionString: process.env.POSTGRES_URL});


class postgres {

    async find(data) {
        const queryString = `SELECT * FROM reminders WHERE "messenger user id" = $1`;

        const result = await pool.query(queryString, [data["messenger user id"]]);

        return result.rows;
    }

    async createNew(data) {
        const {dateInput, timeInput, event, time, userReminderId, "messenger user id": uid} = data;
        const queryData = [dateInput, timeInput, event, time, userReminderId, uid];

        const queryString = `INSERT INTO reminders ("dateInput", "timeInput", event, time, "userReminderId", "messenger user id") 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const result = await pool.query(queryString, queryData);

        return result.rows[0];
    }

    async findOneAndDelete(data) {
        let queryString;

        if (data.id) {
            queryString = `DELETE FROM reminders WHERE "id" = $1 RETURNING *`;

            const result = await pool.query(queryString, [data.id]);

            return result.rows[0];
        }

        queryString = `DELETE FROM reminders WHERE "messenger user id" = $1 AND "userReminderId" = $2 RETURNING *`;

        const result = await pool.query(queryString, [data["messenger user id"], data.userReminderId]);

        return result.rows[0];
    }

    async deleteMany(data) {
        const queryString = `DELETE FROM reminders WHERE "messenger user id" = $1 RETURNING *`;

        const result = await pool.query(queryString, [data["messenger user id"]]);

        return {deletedCount: result.rowCount};
    }

    async getAll() {
        const result = await pool.query(`SELECT * FROM reminders`);

        return result.rows;
    }

    async findByIdAndUpdate(id, data) {
        const queryString = `UPDATE reminders SET "time" = $1 WHERE "id" = $2 RETURNING *`;

        const result = await pool.query(queryString, [data.time, id]);

        return result.rows[0];
    }
}

export default new postgres();