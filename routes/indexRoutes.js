import express from "express";
// import reminderController from "../controllers/reminderController";
import reminderRoutes from "./reminderRoutes.js";
import serviceRoutes from "./serviceRoutes.js";

const router = express.Router();

router.use("/reminders", reminderRoutes);
router.use("/service", serviceRoutes);

router.get('/', (req, res) => {
    res.send('deployed');
});

export default router;
