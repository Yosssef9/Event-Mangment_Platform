import express from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import requestLogger from "./middlewares/requestLogger.js";
import "./models/index.js";

import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());

// ✅ إعداد CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // , // عنوان الـ frontend
    credentials: true, // عشان الكوكيز أو التوكنز تتنقل
  })
);

// Middleware
app.use(requestLogger);
app.use("/api/webhook", webhookRoutes);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/test", testRoutes);

const startServer = async () => {
  await connectDB();

  // Sync models (creates tables if not exist)

  await sequelize.sync({ alter: true });

  console.log("🧩 All models synced with database");
  const tables = await sequelize.showAllSchemas();
  console.log("📋 Schemas in DB:", tables);

  app.listen(process.env.PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  );
};

startServer();
