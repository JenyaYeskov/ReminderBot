import controlService from "../models/controlService.js";

export const controlController = {
    start: (req, res, next) => {
        try {
            let result = controlService.start();

            console.log(result);
            res.send(result);
        } catch (e) {
            next(e);
        }
    },

    stop: (req, res) => {
        controlService.stop();

        res.send("stopped")
    }

}