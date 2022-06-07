import ApiError from "./apiError.js";
import reminderView from "../view/reminderView.js";

export default function handle(err, req, res, next) {
    if (err instanceof ApiError) {
        res.status(err.status);
        adjustStatus(req, res);

        return res.send(reminderView.showResponse(err.message));
    } else {
        console.error(err);
        res.status(500);
        adjustStatus(req, res);

        return res.send(reminderView.showResponse("Something went wrong, please try again."));
    }
}

function adjustStatus(req, res) {
    if (req.headers["user-agent"].toLowerCase().trim() === "chatfuel") {
        res.status(200);
    }
}