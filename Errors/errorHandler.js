import ApiError from "./apiError.js";
import reminderView from "../view/reminderView.js";

export default function handle(err, req, res, next) {
    try {
        if (err instanceof ApiError) {
            res.status(err.status);
            adjustStatus(req, res);

            return res.send(reminderView.showResponse(err.message));
        }

        console.error(err);

        res.status(500);
        adjustStatus(req, res);

        return res.send(reminderView.showResponse("Something went wrong, please try again."));

    } catch (e) {
        console.error(e);
        res.status(500).end("Something went wrong");
    }
}

//Chatfuel doesn't show responses with error status codes, so an OK status is required to display an error message.
function adjustStatus(req, res) {
    if (req.headers["user-agent"] && req.headers["user-agent"].toLowerCase().trim() === "chatfuel") {
        res.status(200);
    }
}