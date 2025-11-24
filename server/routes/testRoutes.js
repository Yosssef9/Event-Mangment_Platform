import express from "express";
import { testSendEmail } from "../controllers/testControllers.js";

const router = express.Router();

router.post("/sendEmail", testSendEmail);

export default router;
