import express from "express";
// import reminderController from "../controllers/reminderController";
import reminderRoutes from "./reminderRoutes.js";
import controlRoutes from "./coontolRoutes.js";

const router = express.Router();

router.use("/reminders", reminderRoutes);
router.use("/control", controlRoutes);

router.get('/', (req, res) => {
    res.send('deployed');
});

export default router;
