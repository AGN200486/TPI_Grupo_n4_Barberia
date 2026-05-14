import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Turno = sequelize.define(
  "Turn",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_barber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    turn_date: {
      type: DataTypes.DATE,
    },
    turn_time: {
      type: DataTypes.TIME,
    },
    status: {
      type: DataTypes.ENUM('Pendiente', 'Cancelado', 'Finalizado'),
      defaultValue: 'Pendiente',
    },
  }, {
    timestamps: false,
  }
);