export const controlController = {
    start: (req, res) => {
        console.log("started");
        res.send("started")
    },

    stop: (req, res) => {
        console.log("stopped");
        res.send("stopped")
    }

}