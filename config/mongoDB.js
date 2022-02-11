import mongoose from "mongoose";
import DB from "./db.js";

export class MongoDB extends DB {
    constructor(name, uri) {
        super(name);
        this.uri = uri;
    }

    async connect() {
        try {
            if (!this.connection) {
                this.connection = await mongoose.connect(this.uri);
            }

            console.log(`Connected to ${this.name}`);
            return this.connection;
        } catch (e) {
            console.error(e);
        }

    }
}

