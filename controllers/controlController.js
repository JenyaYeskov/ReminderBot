import controlService from "../models/controlService.js";

export const controlController = {
    start: (req, res) => {
        controlService.start();

        res.send("started")
    },

    stop: (req, res) => {
        controlService.stop();

        res.send("stopped")
    }

}