import "dotenv/config";
import app from "./app.js";
import {MongooseConnection} from "./config/mongooseConnection.js";

const port = process.env.PORT || 58588;
const mongoConnection = new MongooseConnection("mongo connection 1", process.env.MONGO_URI);

app.listen(port, () => console.log("Server is running"));

try {
    mongoConnection.connect();
} catch (e) {
    console.error(e);
}