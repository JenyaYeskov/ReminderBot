import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import router from "./routes/indexRoutes.js";
import errorHandler from "./Errors/errorHandler.js";
import ApiError from "./Errors/apiError.js";
import controlService from "./models/controlService.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

app.use((req, res, next) => {
    next(new ApiError(404, "Not found."))
});

app.use(errorHandler);


function start() {
    try {
        controlService.start();
    } catch (e) {
        console.error(e);
    }
}

start();

export default app;




