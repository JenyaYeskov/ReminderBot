import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 58588;

app.listen(port, () => console.log('Server is running'));