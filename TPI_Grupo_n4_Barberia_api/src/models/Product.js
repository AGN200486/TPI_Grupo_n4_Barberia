import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false, //Obligatorio el precio para evitar errores
      defaultValue: 0.0
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 //Si es un servicio, por defecto le dejamos 0 en la base de datos
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, //Opcional por si no hay foto al cargarlo
    },
    isService: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false //Si no se aclara, se asume que es un producto físico por defecto
    }
  }, {
    timestamps: false,
  }
);