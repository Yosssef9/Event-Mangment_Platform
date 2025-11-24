// models/ProfileIcon.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // your Sequelize instance

const ProfileIcon = sequelize.define("ProfileIcon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false, // store the Cloudinary URL
  },
});

export default ProfileIcon;
