import "dotenv/config";
import app from "./app.js";
import {MongooseConnection} from "./config/mongooseConnection.js";

const port = process.env.PORT || 58588;

const mongoConnection = new MongooseConnection("mongo connection 1", process.env.MONGO_URI);
try {
    await mongoConnection.connect();
} catch (e) {
    console.error(e);
}

app.listen(port, () => console.log('Server is running'));