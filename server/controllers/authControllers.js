import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ProfileIcon from "../models/ProfileIcon.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "attendee",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("email", email);
    console.log("password", password);
    // ✅ find user
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password", "role", "createdAt"],
      include: [
        {
          model: ProfileIcon,
          as: "profileIcon",
          attributes: ["url"],
        },
      ],
    });

    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    // ✅ check password
    const isMatch = await user.validatePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    // ✅ create token

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon,
        createdAt: user.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ رد النجاح
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role", "createdAt"],
      include: [
        {
          model: ProfileIcon,
          as: "profileIcon",
          attributes: ["url"],
        },
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.log("getMe err", err);
    res.status(403).json({ error: "Invalid token" });
  }
};

// Logout Controller
export const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Server error while logging out" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    if (!payload.email_verified) {
      return res
        .status(400)
        .json({ message: "Email is not verified by Google" });
    }

    let user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password", "role", "createdAt"],
      include: [
        {
          model: ProfileIcon,
          as: "profileIcon",
          attributes: ["url"],
        },
      ],
    });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(20).toString("hex"),
        googleId,
        provider: "google",
        role: "attendee",
      });
    }

    // 🔐 عمل JWT خاص بالموقع
    const jwtToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon,
        createdAt: user.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 حط التوكن في الكوكي
    res.cookie("token", jwtToken, {
      httpOnly: true, // ❌ يمنع JS من قراءته
      secure: process.env.NODE_ENV === "production", // ✅ https فقط في الإنتاج
      sameSite: "Strict", // 🔒 حماية من CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.status(200).json({
      message: "Google login success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(400).json({ error: "Invalid Google token" });
  }
};
