// src/models/Event.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(200),
      allowNull: true, // لو أونلاين ممكن يكون null
    },
    street: {
      type: DataTypes.STRING(200),
      allowNull: true, // لو أونلاين ممكن يكون null
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
    },
    onlineLink: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["Workshop", "Lecture", "Webinar", "Conference", "General"]],
      },
    },
  },
  {
    tableName: "Event", // اسم الجدول في قاعدة البيانات
    timestamps: true, // Sequelize يدير createdAt و updatedAt تلقائي
  },
  {
    freezeTableName: true,
  }
);

export default Event;
