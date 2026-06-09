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
        clientEmail: {
            type: DataTypes.STRING,
            allowNull: false //Para saber qué cliente reservó
        },
        clientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        barberName: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false //"Corte Degradé", etc.
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