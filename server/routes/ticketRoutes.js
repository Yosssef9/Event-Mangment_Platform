import express from "express";
import { getMyTicket, scanTicket } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Attendee: get my tickets
router.get("/getMyTicket", authMiddleware, getMyTicket);

// Organizer: scan a ticket
router.get("/scanTicket/:eventId/:ticketId", authMiddleware, scanTicket);

export default router;
