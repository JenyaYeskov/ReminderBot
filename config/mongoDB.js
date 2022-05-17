import mongoose from "mongoose";
import {DB} from "./db.js";
import {applyHooks} from "./hooks.js";

export class MongoDB extends DB {
    constructor(name, uri) {
        super(name);
        this.uri = uri;
    }

    async connect() {
        try {
            applyHooks(mongoose.connection, this)

            if (!this.connection) {
                this.connection = await mongoose.connect(this.uri);

            }

            return this.connection;
        } catch (e) {
            console.error(e);
        }

    }
}

