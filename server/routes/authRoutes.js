import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logout,
  googleLogin,
} from "../controllers/authControllers.js";
import { validate } from "../middlewares/validate.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isIn(["admin", "organizer", "attendee"])
      .withMessage("Invalid role"),
  ],
  validate, // ✅ runs before registerUser
  registerUser
);

// 📌 Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser
);

router.get("/me", getMe);
router.post("/logout", logout);

router.post("/googleLogin", googleLogin);

export default router;
