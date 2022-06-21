import mongoose from "mongoose";
import {DB} from "./db.js";
import {applyHooks} from "./hooks.js";

export class MongooseConnection extends DB {
    constructor(name, uri) {
        super(name);
        this.uri = uri;
    }

    async connect() {
        applyHooks(mongoose.connection, this);

        try {
            if (!this.connection) {
                this.connection = await mongoose.connect(this.uri);
            }

            return this.connection;
        } catch (e) {
            console.error(e);
        }
    }
}

