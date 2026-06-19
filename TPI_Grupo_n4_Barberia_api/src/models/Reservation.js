import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Reservation = sequelize.define(
    'Reservation',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

export default Reservation; 