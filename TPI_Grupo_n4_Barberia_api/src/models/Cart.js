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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        timestamps: true
    }
);

export default Cart;