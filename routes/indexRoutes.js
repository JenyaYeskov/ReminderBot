import express from "express";
import reminderRoutes from "./reminderRoutes.js";
import controlRoutes from "./contolRoutes.js";

const router = express.Router();

router.use("/reminders", reminderRoutes);
router.use("/control", controlRoutes);

export default router;
