import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getUserBookings,
  getEventDetails,
  cancelBooking,
  getEventAnalytics,
  getEventsTotalAnalytics,
  getRecentEvents,
  getEventUserRating,
  updateEventRating,
} from "../controllers/eventControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadCloud.js";
const router = express.Router();

// router.use(authMiddleware);
router.post(
  "/createEvent",
  authMiddleware,
  upload.single("image"),
  createEvent
);
router.get("/getAllEvents", getAllEvents);
router.get("/getEventById/:eventId", getEventById);
router.get("/getUserBookings/:userId", authMiddleware, getUserBookings);
router.delete("/cancelBooking/:bookingId", authMiddleware, cancelBooking);
router.get("/getEventDetails/:eventId", authMiddleware, getEventDetails);
router.get("/getEventAnalytics/:eventId", authMiddleware, getEventAnalytics);
router.get("/getEventsTotalAnalytics", authMiddleware, getEventsTotalAnalytics);
router.get("/getRecentEvents", authMiddleware, getRecentEvents);
router.get("/getEventUserRating/:eventId", authMiddleware, getEventUserRating);
router.put("/updateEventRating", authMiddleware, updateEventRating);

export default router;
