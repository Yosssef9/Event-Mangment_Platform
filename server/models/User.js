import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";
import ProfileIcon from "./ProfileIcon.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileIconId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProfileIcon,
        key: "id",
      },
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // defaultValue: "attendee",
      validate: {
        isIn: [["admin", "organizer", "attendee"]],
      },
    },
  },
  {
    tableName: "User",
    indexes: [
      {
        unique: true,
        fields: ["email"], // ✅ هنا نحدد الـ unique على مستوى الجدول
      },
    ],
  }
);

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
