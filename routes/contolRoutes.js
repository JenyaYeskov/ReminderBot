import express from "express";
const router = express.Router();
import {controlController} from "../controllers/controlController.js";


router.get('/start', controlController.start);

router.get('/stop', controlController.stop);

export default router;