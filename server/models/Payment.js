import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  eventId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  currency: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  stripeSessionId: { type: DataTypes.STRING },
});

export default Payment;
