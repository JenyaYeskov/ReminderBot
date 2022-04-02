import ApiError from "./apiError.js";

export default function handle(err, req, res, next) {
    console.error(err);

    if (err instanceof ApiError) {
    res.status(err.status);
        return res.send(err.message);
    } else {
        return res.status(500).send("Something went wrong, please try again.");
    }
}