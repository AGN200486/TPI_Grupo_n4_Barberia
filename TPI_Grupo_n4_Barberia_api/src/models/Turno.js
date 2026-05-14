import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Turno = sequelize.define(
  "Turno",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_barbero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_turno: {
      type: DataTypes.DATE,
    },
    hora_turno: {
      type: DataTypes.TIME,
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Cancelado', 'Finalizado'),
      defaultValue: 'Pendiente',
    },
  },
  {
    timestamps: false,
  }
);