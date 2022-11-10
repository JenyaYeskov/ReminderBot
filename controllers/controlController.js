import controlService from "../models/controlService.js";

export const controlController = {

    //Starts reminders time tracking
    start(req, res, next) {
        try {
            let result = controlService.start();

            console.log(result);
            res.send(result);
        } catch (e) {
            next(e);
        }
    },

    //Stops reminders time tracking
    stop(req, res, next) {
        try {
            let result = controlService.stop();

            console.log(result);
            res.send(result);
        } catch (e) {
            next(e);
        }
    }
}