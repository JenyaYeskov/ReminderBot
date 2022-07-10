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
    }

    async findOneAndDelete(data) {

    }

    async deleteMany(data) {

    }

    async getAll() {

    }

    async findByIdAndUpdate(id, data) {

    }
}

export default new postgres();