import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EventAttendee = sequelize.define("EventAttendee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    allowNull: false,
    references: {
      model: "Event",
      key: "id",
    },
  },
  userRating: {
    type: DataTypes.INTEGER,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
  },
});

export default EventAttendee;
