import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER_POSTGRESQL, // username
  process.env.DB_PASSWORD_SQL, // password
  {
    host: process.env.DB_SERVER_POSTGRESQL,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: {
    //   options: {
    //     encrypt: true,
    //     trustServerCertificate: true,
    //   },
    // },
    logging: false, // enable SQL logs for debugging
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to SQL Server with Sequelize");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
