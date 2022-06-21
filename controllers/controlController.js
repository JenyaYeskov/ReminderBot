import controlService from "../models/controlService.js";

export const controlController = {

    //Starts tracking the time of reminders
    start: (req, res, next) => {
        try {
            let result = controlService.start();

            console.log(result);
            res.send(result);
        } catch (e) {
            next(e);
        }
    },

    //Stops tracking the time of reminders
    stop: (req, res, next) => {
        try {
            let result = controlService.stop();

            console.log(result);
            res.send(result);
        } catch (e) {
            next(e);
        }
    }
}