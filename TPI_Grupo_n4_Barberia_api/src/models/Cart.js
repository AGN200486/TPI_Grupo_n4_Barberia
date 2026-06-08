import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Cart = sequelize.define(
    'Cart', 
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Cart;