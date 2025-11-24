import express from "express";
import {
  updateProfileIcon,
  getProfileIcon,
  getAllIcons,
  editProfile,
} from "../controllers/profileControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/updateProfileIcon", authMiddleware, updateProfileIcon);
router.put("/editProfile", authMiddleware, editProfile);
router.get("/getProfileIcon", authMiddleware, getProfileIcon);
router.get("/getAllIcons", authMiddleware, getAllIcons);

export default router;
