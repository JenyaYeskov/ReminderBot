import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import {MongoDB} from "./config/mongoDB.js";
import router from "./routes/indexRoutes.js";

import errorHandler from "./Errors/errorHandler.js";

import controlService from "./models/controlService.js";
import ApiError from "./Errors/apiError.js";


const port = process.env.PORT || 58588;
const app = express();
const mongoConnection = new MongoDB("mongo connection 1", process.env.MONGO_URI)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);
app.use((req, res, next) => {
    next(new ApiError(404, "Not found."))
});
app.use(errorHandler);


async function start() {
    app.listen(port, () => console.log('Server is running'));
    await mongoConnection.connect();

    controlService.start();
}

await start();




