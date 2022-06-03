import ApiError from "./apiError.js";
import reminderView from "../view/reminderView.js";

export default function handle(err, req, res, next) {

    if (err instanceof ApiError) {
        res.status(err.status);
        return res.send(reminderView.showResponse(err.message));
    } else {
        console.error(err);
        return res.status(500).send(reminderView.showResponse("Something went wrong, please try again."));
    }
}