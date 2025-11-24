import { DataTypes } from "sequelize"; // <-- you missed this
import { sequelize } from "../config/db.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      // link ticket to user
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      // link ticket to event
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.TEXT, // base64 QR image
    },
    status: {
      type: DataTypes.STRING,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export default Ticket;
