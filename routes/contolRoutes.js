import express from "express";
import {controlController} from "../controllers/controlController.js";

const router = express.Router();

router.get('/start', controlController.start);

router.get('/stop', controlController.stop);

export default router;